import * as t from '@babel/types';
import type { PluginPass, NodePath } from '@babel/core';
import spreadBodyStatements from './spreadBodyStatements';
import { processHookMemberAccess } from './processHookMemberAccess';
import { getProps } from './utils';

interface FunctionToClass {
  (functionName: string, path: NodePath<t.Function>, state: PluginPass): void;
}

const spreadCustomHook: FunctionToClass = (functionName, path, _state) => {
  const { node } = path;
  let containSkipComment = false;
  const comments = path.node.innerComments;
  if (comments && comments.length > 0) {
    comments.forEach(comment => {
      if (
        comment.value.includes('@Reblend: Transformed from function to class')
      ) {
        containSkipComment = true;
      }
    });
  }

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
  ];

  if (
    containSkipComment ||
    node.type == 'ClassMethod' ||
    excludeHooks.includes(functionName)
  ) {
    return;
  }

  path.addComment(
    'inner',
    ' @Reblend: Transformed from function to class ',
    false,
  );

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

  let hookArguments = getProps(node);
  bodyStatements.unshift(...(hookArguments as any));

  const assignmentStatements = spreadBodyStatements(path, bodyStatements, null);

  const newFunction = t.functionDeclaration(
    t.identifier(functionName),
    node.params as (t.Identifier | t.Pattern | t.RestElement)[],
    t.blockStatement([
      ...assignmentStatements.state,
      (renderReturnStatement as t.ReturnStatement) || t.returnStatement(),
    ]),
  );

  path.scope.removeBinding(functionName);

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
  processHookMemberAccess(path);
};

export default spreadCustomHook;
