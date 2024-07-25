import * as t from '@babel/types';
import { NodePath, TraverseOptions } from '@babel/traverse';
import replaceIdentifiers from './replaceIdentifiers';
import hookBinding from './hookBinding';
import getProps from './getProps';
import spreadBodyStatements from './spreadBodyStatements';

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
  const hasName = !!(node.id
    ? // @ts-ignore
      node.id.name
    : (path.parent as t.VariableDeclarator)?.id
      ? ((path.parent as t.VariableDeclarator).id as t.Identifier).name
      : '');

  if (
    containsJSX &&
    !containSkipComment &&
    node.type !== 'ClassMethod' &&
    hasName
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

    const assignmentStatements: t.ExpressionStatement[] =
      spreadBodyStatements(bodyStatements);

    const constructorMethod = t.classMethod(
      'constructor',
      t.identifier('constructor'),
      [],
      t.blockStatement([
        t.expressionStatement(t.callExpression(t.super(), [])),
      ]),
    );

    const initMethod = t.classMethod(
      'method',
      t.identifier('init'),
      [],
      t.blockStatement([...assignmentStatements]),
    );

    const renderMethod = t.classMethod(
      'method',
      t.identifier('html'),
      [],
      t.blockStatement([renderReturnStatement as any]),
    );

    replaceIdentifiers(path, initMethod!, t, {
      props: getProps(node),
      assignmentStatements,
    });
    hookBinding(path, initMethod!, t);
    replaceIdentifiers(path, renderReturnStatement!, t, {
      props: getProps(node),
      assignmentStatements,
    });

    const classBody = [
      t.classProperty(
        t.identifier('ELEMENT_NAME'),
        t.stringLiteral(
          // @ts-ignore
          node.id
            ? // @ts-ignore
              node.id.name
            : (path.parent as t.VariableDeclarator)?.id
              ? ((path.parent as t.VariableDeclarator).id as t.Identifier).name
              : 'Anonymous',
        ),
        null,
        null,
        undefined,
        true, // to indicate that it's a static property
      ),
      constructorMethod,
      initMethod,
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
