import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import hookBinding from './hookBinding';
import getProps from './getProps';
import spreadBodyStatements from './spreadBodyStatements';
import { hasReblendComment } from './hasReblendComment';
import hasReblendImport from './hasReblendImport';
import spreadCustomHook from './spreadCustomHook';

interface FunctionToClass {
  (path: NodePath<t.Function>, t: typeof import('@babel/types')): void;
}

const functionToClass: FunctionToClass = (path, t) => {
  const { node } = path;
  // @ts-ignore
  const functionName: string = node.id
    ? // @ts-ignore
      node.id.name
    : (path.parent as t.VariableDeclarator)?.id
      ? ((path.parent as t.VariableDeclarator).id as t.Identifier).name
      : '';

  let containSkipComment = false;
  const comments = path.node.innerComments;
  if (comments && comments.length > 0) {
    for (const comment of comments || []) {
      if (comment.value.includes('Transformed from function to class')) {
        containSkipComment = true;
        break;
      }
    }
  }

  if (containSkipComment) {
    return;
  }

  if (functionName.startsWith('use')) {
    return spreadCustomHook(path, t);
  }

  if (!functionName) {
    return;
  }

  let containsJSX = false;
  let isBlockStatement = node.body.type === 'BlockStatement';

  // Check if node body directly contains JSXElement or JSXFragment
  if (node.body.type === 'JSXElement') {
    containsJSX = true;
  } else {
    // Traverse to see if there is any JSXElement or JSXFragment in the subtree
    path.traverse({
      JSXElement(path) {
        containsJSX = true;
        path.stop();
      },
      JSXFragment(path) {
        containsJSX = true;
        path.stop();
      },
    });
  }

  // Check if the current path is within a function hierarchy (FunctionDeclaration, FunctionExpression, or ArrowFunctionExpression)
  const mustNot = !path.findParent(parentPath => {
    // Check if inside an ObjectProperty, Function Declaration, Function Expression, Arrow Function, or a function's arguments/parameters
    if (
      parentPath.isObjectProperty() ||
      parentPath.isFunctionDeclaration() ||
      parentPath.isFunctionExpression() ||
      parentPath.isArrowFunctionExpression() ||
      parentPath.isClassMethod() ||
      parentPath.isClassPrivateMethod() ||
      parentPath.isClassBody()
    ) {
      return true;
    }

    // Check if the path is inside a function argument/parameter
    if (
      parentPath.isCallExpression() &&
      parentPath.node.arguments.includes(path.node as any)
    ) {
      return true;
    }

    // Check if the path is inside a function's parameter list
    const functionParent = parentPath.isFunction()
      ? parentPath
      : parentPath.findParent(p => p.isFunction());
    if (
      functionParent &&
      (functionParent.node as any).params.includes(path.node)
    ) {
      return true;
    }

    return false;
  });

  const must = !hasReblendComment('NotComponent', path);

  // Proceed with transformation only if no 'NotComponent' comment and the node is not in a function hierarchy
  if (
    (hasReblendComment('Component', path) && must) ||
    (containsJSX && must && node.type !== 'ClassMethod' && mustNot)
  ) {
    path.addComment('inner', ' Transformed from function to class ', false);

    const body = (node as t.FunctionDeclaration).body.body || [];

    const unsupported = new Error(
      `Reblend does not support conditional returns i.e Return statement should be the last statement in the function component
      ${functionName} ${(path.hub as any).file.opts.filename}:${node.loc?.start.line}:${node.loc?.start.column}`,
    );

    const bodyStatements: t.Statement[] = [];
    let renderReturnStatement: t.ReturnStatement | undefined =
      !isBlockStatement && t.isJSXElement(node.body)
        ? t.returnStatement(node.body as t.JSXElement)
        : undefined;

    body.forEach(statement => {
      if (t.isReturnStatement(statement)) {
        if (renderReturnStatement) {
          throw unsupported;
        }
        renderReturnStatement = statement;
      } else {
        bodyStatements.push(statement);
      }
    });

    if (!renderReturnStatement) {
      throw unsupported;
    }

    const stateAssignments: any[] = [];
    const propsAssignments: any[] = [
      //Props initializer
      t.expressionStatement(
        t.assignmentExpression(
          '=',
          t.memberExpression(t.thisExpression(), t.identifier('props')),
          t.objectExpression([]),
        ),
      ),
    ];

    let initPropsMethodArgument = getProps(node);
    if (initPropsMethodArgument?.length > 1) {
      if (
        !t.isIdentifier(initPropsMethodArgument[1]) ||
        initPropsMethodArgument[1].name !== 'thisComponent'
      ) {
        throw new Error(
          `Reblend only support \`thisComponent\` as the second parameter when there's two params for components
        ${functionName} ${(path.hub as any).file.opts.filename}:${node.loc?.start.line}:${node.loc?.start.column}`,
        );
      } else if (initPropsMethodArgument.length > 2) {
        throw new Error(
          `Reblend does not support multiple props parameter's for components
          ${functionName} ${(path.hub as any).file.opts.filename}:${node.loc?.start.line}:${node.loc?.start.column}`,
        );
      }
    }

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
    );

    const initPropsMethod = t.classMethod(
      'method',
      t.identifier('initProps'),
      initPropsMethodArgument,
      t.blockStatement([...propsAssignments]),
    );

    const renderMethod = t.classMethod(
      'method',
      t.identifier('html'),
      [],
      t.blockStatement([renderReturnStatement as any]),
    );

    hookBinding(path, initStateMethod!, t);
    hookBinding(path, initPropsMethod!, t);

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

    const classDecl = t.classDeclaration(
      //@ts-ignore
      node.id ? t.identifier(node.id.name) : null,
      t.identifier('Reblend'),
      t.classBody(classBody),
      [],
    );

    const classExpr = t.classExpression(
      //@ts-ignore
      node.id ? t.identifier(node.id.name) : null,
      t.identifier('Reblend'),
      t.classBody(classBody),
      [],
    );

    //@ts-ignore
    node.id?.name && path.scope.removeBinding(node.id?.name);

    //@ts-ignore
    if (t.isExpression(path)) {
      path.replaceWith(classExpr);
    } else {
      path.replaceWith(classDecl);
    }
  }
};

export default functionToClass;
