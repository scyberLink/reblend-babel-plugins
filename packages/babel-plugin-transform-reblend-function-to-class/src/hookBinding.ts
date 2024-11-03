import * as type from '@babel/types';
import { NodePath } from '@babel/traverse';
import generate from '@babel/generator';

function hookBinding(
  path: NodePath<type.Function>,
  node: type.Node,
  t: typeof import('@babel/types'),
) {
  const visitor = {
    CallExpression(p: NodePath<type.CallExpression>) {
      if (
        t.isIdentifier(p.node.callee) &&
        p.node.callee.name.startsWith('use')
      ) {
        //Bind custom hooks to this
        const bindCall = t.callExpression(
          t.memberExpression(p.node.callee, t.identifier('bind')),
          [t.thisExpression()],
        );

        const dep = p.node.arguments[1] as type.ArrayExpression;
        if (
          (p.node.callee.name === 'useEffect' ||
            p.node.callee.name === 'useMemo') &&
          dep
        ) {
          const stringValue = generate(dep).code;
          p.node.arguments[1] = t.stringLiteral(stringValue);
        }

        const newCallExpression = t.callExpression(bindCall, p.node.arguments);

        if (t.isVariableDeclarator(p.parent)) {
          let variableName: type.Identifier = t.identifier('');

          if (t.isArrayPattern(p.parent.id)) {
            variableName = p.parent.id.elements[0] as type.Identifier;
          } else if (t.isIdentifier(p.parent.id)) {
            variableName = p.parent.id;
          }

          p.node.arguments[p.node.arguments.length] = t.stringLiteral(
            variableName?.name || 'unneededIdentifier',
          );
        }

        p.replaceWith(newCallExpression);
      }
    },
  };

  path.scope.traverse(node!, visitor);
}

export default hookBinding;
