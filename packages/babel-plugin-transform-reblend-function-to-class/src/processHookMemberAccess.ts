import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { isHookName } from './utils';

export function processHookMemberAccess(path: NodePath) {
  path.traverse({
    MemberExpression(innerPath) {
      const propertyName = (innerPath.node.property as t.Identifier).name;
      if (!isHookName(propertyName) || isAlreadyBound(innerPath)) {
        return;
      }

      const parentPath = t.isSequenceExpression(innerPath.parent)
        ? innerPath.parentPath.parentPath
        : innerPath.parentPath;

      bindThis(
        innerPath,
        innerPath.node.property as t.Identifier,
        (parentPath?.node as t.CallExpression).arguments,
        parentPath?.parent,
        {
          object: innerPath.node.object as t.Identifier,
          property: innerPath.node.property as t.Identifier,
          computed: innerPath.node.computed,
        },
      );
    },

    CallExpression(p: NodePath<t.CallExpression>) {
      if (!t.isIdentifier(p.node.callee) || !isHookName(p.node.callee.name)) {
        return;
      }
      bindThis(p, p.node.callee, p.node.arguments, p.parent);
    },
  });
}

function bindThis(
  path: NodePath,
  callee: t.Identifier,
  calleeArguments: any[],
  parent: any,
  asMemberObject?: {
    object: t.Identifier;
    property: t.Identifier;
    computed: boolean;
  },
) {
  //Bind custom hooks call to `this`
  const newCallExpression = asMemberObject
    ? t.callExpression(
        t.memberExpression(
          t.memberExpression(
            asMemberObject.object,
            asMemberObject.property,
            asMemberObject.computed,
          ),
          t.identifier('bind'),
        ),
        [t.thisExpression()],
      )
    : t.callExpression(
        t.callExpression(t.memberExpression(callee, t.identifier('bind')), [
          t.thisExpression(),
        ]),
        calleeArguments,
      );

  const includeForDependencyArgument = [
    'useEffect',
    'useMemo',
    'useEffectAfter',
  ];

  const dep = calleeArguments[1];
  if (dep && includeForDependencyArgument.includes(callee.name)) {
    // Use an arrow function bound to this, not an IIFE
    const arrowFn = t.arrowFunctionExpression([], dep);
    const boundArrowFn = t.callExpression(
      t.memberExpression(arrowFn, t.identifier('bind')),
      [t.thisExpression()],
    );
    calleeArguments[1] = boundArrowFn;
  }

  const includeForVariableDeclarator = [
    'useState',
    'useReducer',
    'useMemo',
    'useContext',
  ];

  if (
    includeForVariableDeclarator.includes(callee.name) &&
    t.isVariableDeclarator(parent)
  ) {
    let variableName: t.Identifier = t.identifier('');

    if (t.isArrayPattern(parent.id)) {
      variableName = parent.id.elements[0] as t.Identifier;
    } else if (t.isIdentifier(parent.id)) {
      variableName = parent.id as t.Identifier;
    }

    calleeArguments.push(
      t.stringLiteral(variableName?.name || 'unneededIdentifier'),
    );
  }

  path.replaceWith(newCallExpression);
  return newCallExpression;
}

function isAlreadyBound(path: NodePath) {
  return (
    t.isMemberExpression(path.parent) &&
    (path.parent.property as t.Identifier).name === 'bind'
  );
}
