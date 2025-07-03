import * as t from '@babel/types';
import type { PluginPass, NodePath } from '@babel/core';

import spreadBodyStatements from './spreadBodyStatements';
import spreadCustomHook from './spreadCustomHook';
import { processHookMemberAccess } from './processHookMemberAccess';
import {
  get,
  getProps,
  hasReblendComment,
  isComponentName,
  isHookName,
  REBLEND_IMPORT_NAME_ID,
  TRANSFORMED_COMMENT,
} from './utils';

interface FunctionToClass {
  (path: NodePath<t.Function>, state: PluginPass): void;
}

const functionToClass: FunctionToClass = (path, state) => {
  const { node } = path;

  let containSkipComment = false;
  const comments = path.node.innerComments;
  if (comments && comments.length > 0) {
    for (const comment of comments || []) {
      if (comment.value.includes(TRANSFORMED_COMMENT.trim())) {
        containSkipComment = true;
        break;
      }
    }
  }

  // @ts-ignore
  const functionName: string = node.id
    ? // @ts-ignore
      node.id.name
    : (path.parent as t.VariableDeclarator)?.id
      ? ((path.parent as t.VariableDeclarator).id as t.Identifier).name
      : '';

  const excludeHooks = [
    'useState',
    'useReducer',
    'useRef',
    'useMemo',
    'useCallback',
    'useEffect',
    'useContext',
    'useTransition',
    'useEffectAfter',
    'useProps',
  ];

  if (
    !functionName ||
    containSkipComment ||
    node.type == 'ClassMethod' ||
    excludeHooks.includes(functionName)
  ) {
    return;
  }

  if (isHookName(functionName)) {
    return spreadCustomHook(functionName, path, state);
  }

  let isBlockStatement = node.body.type === 'BlockStatement';

  // Proceed with transformation only if no '@ReblendNotComponent' comment or "@ReblendComponent"
  if (
    (hasReblendComment('Component', path) &&
      !hasReblendComment('NotComponent', path)) ||
    isComponentName(functionName)
  ) {
    path.addComment('inner', TRANSFORMED_COMMENT, false);

    const body = (node as t.FunctionDeclaration).body.body || [];

    const bodyStatements: t.Statement[] = [];
    let renderReturnStatement: t.ReturnStatement | undefined = !isBlockStatement
      ? t.returnStatement(node.body as t.JSXElement)
      : undefined;

    body.forEach(statement => {
      if (t.isReturnStatement(statement)) {
        if (renderReturnStatement) {
          throw new Error(
            `Reblend does not support conditional returns i.e Return statement should be the last statement in the function component ${functionName} ${(path.hub as any).file.opts.filename}:${node.loc?.start.line}:${node.loc?.start.column}`,
          );
        }
        renderReturnStatement = statement;
      } else {
        bodyStatements.push(statement);
      }
    });

    let initPropsMethodArgument = getProps(node);
    if (initPropsMethodArgument.length > 1) {
      throw new Error(
        `Reblend does not support multiple props parameter's for components
          ${functionName} ${(path.hub as any).file.opts.filename}:${node.loc?.start.line}:${node.loc?.start.column}`,
      );
    }

    const stateAssignments: any[] = [];
    const propsAssignments: any[] = [
      //Props initializer
      t.expressionStatement(
        t.assignmentExpression(
          '=',
          t.memberExpression(t.thisExpression(), t.identifier('props')),
          t.assignmentExpression(
            '||',
            t.memberExpression(
              t.identifier('arguments'),
              t.identifier('0'),
              true,
            ),
            t.objectExpression([]),
          ),
        ),
      ),
    ];

    const assignments = spreadBodyStatements(
      path,
      bodyStatements,
      initPropsMethodArgument as any,
    );
    propsAssignments.push(...assignments.props);
    stateAssignments.push(...assignments.state);

    const constructorMethod = t.classMethod(
      'constructor',
      t.identifier('constructor'),
      [],
      t.blockStatement([
        t.expressionStatement(t.callExpression(t.super(), [])),
      ]),
    );

    const initStateMethod = t.classMethod(
      'method',
      t.identifier('initState'),
      [],
      t.blockStatement([...stateAssignments]),
      undefined,
      undefined,
      undefined,
      true,
    );

    const initPropsMethod = t.classMethod(
      'method',
      t.identifier('initProps'),
      initPropsMethodArgument,
      t.blockStatement([...propsAssignments]),
      undefined,
      undefined,
      undefined,
      true,
    );

    const renderMethod = t.classMethod(
      'method',
      t.identifier('html'),
      [],
      t.blockStatement([(renderReturnStatement as any) || t.returnStatement()]),
      undefined,
      undefined,
      undefined,
      true,
    );

    const classBody = [
      t.classProperty(
        t.identifier('ELEMENT_NAME'),
        t.stringLiteral(functionName || 'Anonymous'),
        null,
        null,
        undefined,
        true, // to indicate that it's a static property
      ),
      constructorMethod,
      initStateMethod,
      initPropsMethod,
      renderMethod,
    ];

    const reblendImportNode = get(state, REBLEND_IMPORT_NAME_ID);
    const reblendSuperNode = t.cloneNode(reblendImportNode);
    const classDecl = t.classDeclaration(
      //@ts-ignore
      node.id ? t.identifier(node.id.name) : null,
      reblendSuperNode,
      t.classBody(classBody),
      [],
    );

    const classExpr = t.classExpression(
      //@ts-ignore
      node.id ? t.identifier(node.id.name) : null,
      reblendSuperNode,
      t.classBody(classBody),
      [],
    );

    path.scope.removeBinding(functionName);

    //@ts-ignore
    if (t.isExpression(path)) {
      path.replaceWith(classExpr);
    } else {
      path.replaceWith(classDecl);
    }
    processHookMemberAccess(path);
  }
};

export default functionToClass;
