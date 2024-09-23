import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import hookBinding from './hookBinding';
import getProps from './getProps';
import spreadBodyStatements from './spreadBodyStatements';
import hasReblendComponentComment from './hasReblendComponentComment';

interface FunctionToClass {
  (
    path: NodePath<t.Function>,
    node: t.Function,
    t: typeof import('@babel/types'),
  ): void;
}

const functionToClass: FunctionToClass = (path, node, t) => {
  let containsJSX = false;
  let isBlockStatement = node.body.type === 'BlockStatement';

  if (node.body.type === 'JSXElement') {
    containsJSX = true;
  } else {
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

  let containSkipComment = false;
  const comments = path.node.innerComments;
  if (comments && comments.length > 0) {
    comments.forEach(comment => {
      if (comment.value.includes('Transformed from function to class')) {
        containSkipComment = true;
      }
    });
  }

  // @ts-ignore
  const functionName = node.id
    ? // @ts-ignore
      node.id.name
    : (path.parent as t.VariableDeclarator)?.id
      ? ((path.parent as t.VariableDeclarator).id as t.Identifier).name
      : '';

  // @ts-ignore
  const hasName = !!functionName;

  const must = !containSkipComment && node.type !== 'ClassMethod' && hasName;

  if (
    ((hasReblendComponentComment(node) ||
      hasReblendComponentComment(
        path?.parentPath?.parentPath?.node as t.Function,
      )) &&
      must) ||
    (containsJSX && must)
  ) {
    path.addComment('inner', ' Transformed from function to class ', false);

    const body = (node as t.FunctionDeclaration).body.body || [];

    const bodyStatements: t.Statement[] = [];
    let renderReturnStatement: t.ReturnStatement | undefined =
      !isBlockStatement && t.isJSXElement(node.body)
        ? t.returnStatement(node.body as t.JSXElement)
        : undefined;

    body.forEach(statement => {
      if (t.isReturnStatement(statement)) {
        renderReturnStatement = statement;
      } else {
        bodyStatements.push(statement);
      }
    });

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
