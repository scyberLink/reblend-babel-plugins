import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

enum PropStateType {
  NONE,
  PROPS,
  STATE,
}

enum DeclarationType {
  NONE,
  ARRAY_PATTERN,
  OBJECT_PATTERN,
  DECLARATION,
  DECLARATOR,
}

function spreadBodyStatements(
  path: NodePath<t.Function>,
  bodyStatements: t.Statement[] | null,
  propsStatements: t.Statement[] | null,
): {
  props: t.ExpressionStatement[];
  state: t.ExpressionStatement[];
} {
  const stateAssignments: any[] = [];
  const propsAssignments: any[] = [];
  const assignmentPaths = new Set<NodePath<t.AssignmentExpression>>();

  path.scope.path.traverse({
    AssignmentExpression(assignmentPath) {
      assignmentPaths.add(assignmentPath);
    },
  });

  const replaceableAssignmentPaths: {
    assignmentPath: NodePath<t.AssignmentExpression>;
    mapping: t.MemberExpression;
  }[] = [];

  const constructAssignment = (
    constructNode: t.Node,
    declarationType: DeclarationType,
    from: PropStateType,
  ) => {
    let assignment: t.Statement | undefined;

    switch (declarationType) {
      case DeclarationType.ARRAY_PATTERN:
      case DeclarationType.OBJECT_PATTERN:
        /* assignment = t.variableDeclaration('const', [
          constructNode as t.VariableDeclarator,
        ]); // Wrap in VariableDeclaration */
        break;

      case DeclarationType.DECLARATION:
      default:
        assignment = constructNode as any;
        break;
    }

    if (assignment) {
      switch (from) {
        case PropStateType.STATE:
          stateAssignments.push(assignment);
          break;

        case PropStateType.PROPS:
          propsAssignments.push(assignment);
          break;

        default:
          break;
      }
    }
  };

  const runner = (
    runnerNode: t.Node,
    from: PropStateType,
    parent: t.Node | null,
  ) => {
    if (t.isIdentifier(runnerNode)) {
      let propertyThisMap = null;

      switch (from) {
        case PropStateType.STATE:
          propertyThisMap = t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier('state')),
            runnerNode,
          );
          break;

        case PropStateType.PROPS:
          propertyThisMap = t.memberExpression(
            t.thisExpression(),
            parent ? t.identifier('props') : runnerNode,
          );
          break;

        default:
          break;
      }

      let parentIsObjectProperty;
      if (
        t.isObjectProperty(parent) &&
        propertyThisMap &&
        from === PropStateType.PROPS
      ) {
        parentIsObjectProperty = t.memberExpression(
          propertyThisMap,
          parent.key,
        );
      }

      const mapping: any = parentIsObjectProperty || propertyThisMap;

      let statement = null;
      if (
        t.isRestElement(parent) &&
        propertyThisMap &&
        from === PropStateType.PROPS
      ) {
        statement = t.expressionStatement(
          t.assignmentExpression(
            '=',
            mapping,
            t.objectExpression([
              t.spreadElement(mapping),
              t.spreadElement(runnerNode),
            ]),
          ),
        );
      } else {
        statement = t.expressionStatement(
          t.assignmentExpression('=', mapping, runnerNode),
        );
      }

      switch (from) {
        case PropStateType.STATE:
          stateAssignments.push(statement);
          break;

        case PropStateType.PROPS:
          propsAssignments.push(statement);
          break;

        default:
          break;
      }

      const varName = runnerNode.name;
      const binding = path.scope.getBinding(varName);

      if (binding) {
        binding.referencePaths.forEach(refPath => {
          let jsxNode = null;
          if (t.isJSXIdentifier(refPath.node as t.JSXIdentifier)) {
            switch (from) {
              case PropStateType.STATE:
                jsxNode = t.jSXMemberExpression(
                  t.jSXMemberExpression(
                    t.jsxIdentifier('this'),
                    t.jsxIdentifier('state'),
                  ),
                  refPath.node as t.JSXIdentifier,
                );
                break;

              case PropStateType.PROPS:
                jsxNode = t.jSXMemberExpression(
                  parent
                    ? t.jSXMemberExpression(
                        t.jsxIdentifier('this'),
                        t.jsxIdentifier('props'),
                      )
                    : t.jsxIdentifier('this'),
                  refPath.node as t.JSXIdentifier,
                );
                break;

              default:
                break;
            }
          }

          refPath.replaceWith(jsxNode || mapping);
        });
        assignmentPaths.forEach(assignmentPath => {
          const { left, right } = assignmentPath.node;
          // Check if the LHS is the identifier we're working with (e.g., `reassignmentMapping_data`)
          const assignmentBinding = assignmentPath.scope.getBinding(varName);

          // Ensure the assignment is in the same block scope as the original identifier
          if (
            assignmentBinding === binding &&
            t.isIdentifier(left, { name: varName })
          ) {
            replaceableAssignmentPaths.push({
              assignmentPath,
              mapping,
            });
            assignmentPaths.delete(assignmentPath);
          }
        });
      }
      return;
    }

    if (t.isVariableDeclaration(runnerNode)) {
      constructAssignment(runnerNode, DeclarationType.DECLARATION, from);
      runnerNode.declarations.forEach(
        declarator => declarator && runner(declarator, from, null),
      );
    } else if (t.isVariableDeclarator(runnerNode)) {
      runner(runnerNode.id, from, null);
    } else if (t.isFunctionDeclaration(runnerNode)) {
      const arrowFunction = t.arrowFunctionExpression(
        runnerNode.params, // Use the same parameters
        runnerNode.body, // Use the same function body
        runnerNode.async, // Retain whether the original function was async
      );

      // Preserve comments from the original function
      arrowFunction.leadingComments = runnerNode.leadingComments;
      arrowFunction.innerComments = runnerNode.innerComments;
      arrowFunction.trailingComments = runnerNode.trailingComments;

      // Wrap the arrow function into a VariableDeclarator and then into a VariableDeclaration
      const variableDeclarator = t.variableDeclarator(
        runnerNode.id!,
        arrowFunction,
      );
      const variableDeclaration = t.variableDeclaration('const', [
        variableDeclarator,
      ]);

      constructAssignment(
        variableDeclaration,
        DeclarationType.DECLARATION,
        from,
      );

      if (runnerNode.id) {
        runner(runnerNode.id, from, null);
      }
    } else if (t.isObjectProperty(runnerNode)) {
      runner(runnerNode.value, from, runnerNode);
    } else if (t.isObjectPattern(runnerNode)) {
      runnerNode.properties.forEach(
        (property: t.ObjectProperty | t.RestElement) => {
          if (property) {
            if (t.isObjectProperty(property)) {
              runner(property.value, from, property);
            } else if (t.isRestElement(property)) {
              runner(property.argument, from, property);
            }
          }
        },
      );
    } else if (t.isArrayPattern(runnerNode)) {
      runnerNode.elements.forEach((element: any) => {
        if (element) {
          if (t.isRestElement(element)) {
            runner(element.argument, from, t.restElement(element));
          } else {
            runner(
              element,
              from,
              t.objectProperty(element, t.stringLiteral('')),
            );
          }
        }
      });
    } else if (t.isAssignmentPattern(runnerNode)) {
      runner(runnerNode.left, from, parent);
    } else {
      constructAssignment(runnerNode, DeclarationType.DECLARATION, from);
    }
  };

  bodyStatements?.forEach(statement => {
    runner(statement, PropStateType.STATE, null);
  });

  propsStatements?.forEach((statement: any) => {
    runner(statement, PropStateType.PROPS, null);
  });

  replaceableAssignmentPaths.forEach(({ assignmentPath, mapping }) => {
    assignmentPath.node.left = mapping;
    assignmentPath.replaceWith(
      t.assignmentExpression('=', mapping, assignmentPath.node.right),
    );
  });

  return {
    props: propsAssignments,
    state: stateAssignments,
  };
}

export default spreadBodyStatements;
