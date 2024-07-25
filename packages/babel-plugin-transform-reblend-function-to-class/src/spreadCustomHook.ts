import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import replaceIdentifiers from './replaceIdentifiers';
import hookBinding from './hookBinding';
import spreadBodyStatements from './spreadBodyStatements';

interface FunctionToClass {
  (
    path: NodePath<t.Function>,
    node: t.Function,
    t: typeof import('@babel/types'),
  ): void;
}

const spreadCustomHook: FunctionToClass = (path, node, t) => {
  let containSkipComment = false;
  const comments = path.node.innerComments;
  if (comments && comments.length > 0) {
    comments.forEach(comment => {
      if (comment.value.includes('Transformed from function to class')) {
        containSkipComment = true;
      }
    });
  }

  if (!containSkipComment && node.type !== 'ClassMethod') {
    path.addComment('inner', ' Transformed from function to class ', false);

    const body = (node as t.FunctionDeclaration).body.body;

    const bodyStatements: t.Statement[] = [];
    let renderReturnStatement: t.ReturnStatement | undefined;

    body.forEach(statement => {
      if (t.isReturnStatement(statement)) {
        renderReturnStatement = statement;
      } else {
        bodyStatements.push(statement);
      }
    });

    const assignmentStatements: t.ExpressionStatement[] =
      spreadBodyStatements(bodyStatements);

    const newFunction = t.functionDeclaration(
      t.identifier(
        //@ts-ignore
        node.id
          ? // @ts-ignore
            node.id.name
          : (path.parent as t.VariableDeclarator)?.id
            ? ((path.parent as t.VariableDeclarator).id as t.Identifier).name
            : '',
      ),
      node.params as (t.Identifier | t.Pattern | t.RestElement)[],
      t.blockStatement([
        ...assignmentStatements,
        renderReturnStatement as t.ReturnStatement,
      ]),
    );

    replaceIdentifiers(path, newFunction!, t, {
      props: [],
      assignmentStatements,
    });
    hookBinding(path, newFunction!, t);

    //@ts-ignore
    node.id?.name && path.scope.removeBinding(node.id?.name);

    //@ts-ignore
    if (t.isExpression(path)) {
      const fex = t.functionExpression(
        newFunction.id,
        newFunction.params,
        newFunction.body,
      );
      fex.leadingComments = newFunction.leadingComments;
      fex.innerComments = newFunction.innerComments;
      fex.trailingComments = newFunction.trailingComments;
      path.replaceWith(fex);
    } else {
      path.replaceWith(newFunction);
    }
  }
};

export default spreadCustomHook;
