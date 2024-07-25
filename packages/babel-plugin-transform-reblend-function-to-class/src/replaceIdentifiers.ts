import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

type ReplaceIdentifiersOption = {
  assignmentStatements: t.ExpressionStatement[];
  props:
    | (t.ObjectProperty | t.RestElement)[]
    | (
        | t.ArrayPattern
        | t.AssignmentPattern
        | t.Identifier
        | t.RestElement
        | t.TSParameterProperty
      )[];
};

function replaceIdentifiers(
  path: NodePath<t.Function>,
  node: t.Node,
  t: typeof import('@babel/types'),
  { assignmentStatements, props }: ReplaceIdentifiersOption,
) {
  const visitor = {
    ReferencedIdentifier(p: NodePath<t.Identifier | t.JSXIdentifier>) {
      const binding = p.scope?.getBinding(p.node?.name);
      if (binding) {
        binding.referencePaths.forEach(refPath => {
          const node: t.Identifier = refPath.node as any;
          const identifierName = node.name;
          //const isVariableDeclarator =
          //  t.isVariableDeclarator(p.parentPath.container as any) ||
          //  t.isVariableDeclarator(p.parent as any);
          const isAssignmentExpression = t.isAssignmentExpression(
            p.parent as any,
          );
          const isFunctionDeclaration = t.isFunctionDeclaration(
            p.parent as any,
          );
          const isVariableDeclaration = t.isVariableDeclaration(p as any);
          const isObjectPattern = t.isObjectPattern(
            p.parentPath.parentPath?.node,
          );

          if (
            t.isThisExpression((refPath.node as any).object) ||
            t.isThisExpression((refPath.node as any).object?.object) ||
            t.isThisExpression((p.parent as any).object) ||
            t.isThisExpression((p.parent as any).object?.object) ||
            //isVariableDeclarator ||
            isAssignmentExpression ||
            isFunctionDeclaration ||
            isVariableDeclaration ||
            isObjectPattern
          ) {
            return;
          }
          //Checks whether the identifier is defined in the body of Reblend Function Component
          const hasThisId = assignmentStatements.find(assignment => {
            const exp = assignment.expression as any;
            return (
              exp &&
              t.isMemberExpression(exp.left) &&
              t.isIdentifier(exp.left.property) &&
              exp.left.property.name === identifierName
            );
          });

          //Checks whether the identifier is defined in the prop argument of Reblend Function Component
          const hasPropId = props.find(ident =>
            t.isObjectProperty(ident)
              ? (ident.key as any).name === identifierName
              : t.isIdentifier(ident) && ident.name === identifierName,
          );

          let asObjectProperty;

          const jsxNode = t.isJSXIdentifier(node)
            ? t.jSXMemberExpression(
                t.isObjectProperty(hasPropId)
                  ? t.jSXMemberExpression(
                      t.jsxIdentifier('this'),
                      t.jsxIdentifier('props'),
                    )
                  : t.jsxIdentifier('this'),
                node,
              )
            : null;

          //Map states and props variable to this
          const propertyThisMap = jsxNode
            ? null
            : t.memberExpression(
                t.thisExpression(),
                t.isObjectProperty(hasPropId) ? t.identifier('props') : node,
              );

          if (t.isObjectProperty(refPath.parent) && propertyThisMap) {
            asObjectProperty = t.objectProperty(
              refPath.parent.key,
              propertyThisMap,
            );
          }

          const notAlreadyEvaluatedJsxNode = p.node?.name !== 'this';

          if (hasThisId) {
            if (jsxNode) {
              if (notAlreadyEvaluatedJsxNode) {
                refPath.replaceWith(jsxNode);
              }
            } else if (propertyThisMap) {
              if (asObjectProperty) {
                if (
                  (refPath.parent as t.ObjectProperty).computed &&
                  refPath.node == (refPath.parent as t.ObjectProperty).key
                )
                  (refPath.parent as t.ObjectProperty).key = propertyThisMap;
                else
                  (refPath.parent as t.ObjectProperty).value = propertyThisMap;
              } else {
                (asObjectProperty ? refPath.parentPath : refPath)?.replaceWith(
                  asObjectProperty || propertyThisMap,
                );
              }
            }
          } else if (hasPropId) {
            //Replaces props reference as `this.props.identifier`
            if (jsxNode) {
              if (notAlreadyEvaluatedJsxNode) {
                refPath.replaceWith(jsxNode);
              }
            } else if (propertyThisMap) {
              if (t.isObjectProperty(hasPropId)) {
                if (asObjectProperty) {
                  if (
                    (refPath.parent as t.ObjectProperty).computed &&
                    refPath.node == (refPath.parent as t.ObjectProperty).key
                  ) {
                    (refPath.parent as t.ObjectProperty).key =
                      t.memberExpression(propertyThisMap, node);
                  } else {
                    (refPath.parent as t.ObjectProperty).value =
                      t.memberExpression(propertyThisMap, node);
                  }
                } else {
                  (asObjectProperty
                    ? refPath.parentPath
                    : refPath
                  )?.replaceWith(
                    asObjectProperty ||
                      t.memberExpression(propertyThisMap, node),
                  );
                }
              } else {
                if (asObjectProperty) {
                  if (
                    (refPath.parent as t.ObjectProperty).computed &&
                    refPath.node == (refPath.parent as t.ObjectProperty).key
                  )
                    (refPath.parent as t.ObjectProperty).key = propertyThisMap;
                  else
                    (refPath.parent as t.ObjectProperty).value =
                      propertyThisMap;
                } else {
                  (asObjectProperty
                    ? refPath.parentPath
                    : refPath
                  )?.replaceWith(asObjectProperty || propertyThisMap);
                }
              }
            }
          }
        });
      }
    },
  };

  path.scope.traverse(node!, visitor);
}

export default replaceIdentifiers;
