import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { isHookName, isTypescriptNode } from './utils';
import { randomUUID } from 'crypto';

export function processHookMemberAccess(path: NodePath) {
  path.traverse({
    MemberExpression(innerPath) {
      const propertyName = (innerPath.node.property as t.Identifier).name;
      if (!isHookName(propertyName) || isAlreadyBound(innerPath)) {
        return;
      }

      if ((innerPath.node.object as any)?.object?.type === 'ThisExpression') {
        // If the object is already bound to `this`, we don't need to do anything
        return;
      }

      let parentPath = t.isSequenceExpression(innerPath.parent)
        ? innerPath.parentPath.parentPath
        : innerPath.parentPath;

      parentPath = !parentPath
        ? parentPath
        : getNonTypescriptParent(parentPath!);

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
      const parentPath = getNonTypescriptParent(p);
      bindThis(p, p.node.callee, p.node.arguments, parentPath.parent);
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

  const shouldIncludeDependency =
    dep && includeForDependencyArgument.includes(callee.name);

  if (shouldIncludeDependency) {
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
      t.stringLiteral(variableName?.name || `unneededIdentifier_${randomUUID()}`),
    );
  }

  if (shouldIncludeDependency && callee.name == 'useMemo') {
    if (calleeArguments.length >= 2) {
      const lastIdx = calleeArguments.length - 1;
      const temp = calleeArguments[lastIdx];
      calleeArguments[lastIdx] = calleeArguments[lastIdx - 1];
      calleeArguments[lastIdx - 1] = temp;
    }
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

function getNonTypescriptParent(path: NodePath) {
  let parentPath = path;
  while (parentPath && isTypescriptNode(parentPath.parent)) {
    parentPath = parentPath.parentPath!;
  }
  return parentPath;
}
