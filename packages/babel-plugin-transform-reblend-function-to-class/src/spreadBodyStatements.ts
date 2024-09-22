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
      const propertyThisMap = t.memberExpression(
        t.thisExpression(),
        parent && from === PropStateType.PROPS
          ? t.identifier('props')
          : runnerNode,
      );

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

      const statement = t.expressionStatement(
        t.assignmentExpression('=', mapping, runnerNode),
      );

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
          const jsxNode = t.isJSXIdentifier(refPath.node as t.JSXIdentifier)
            ? t.jSXMemberExpression(
                parent && from === PropStateType.PROPS
                  ? t.jSXMemberExpression(
                      t.jsxIdentifier('this'),
                      t.jsxIdentifier('props'),
                    )
                  : t.jsxIdentifier('this'),
                refPath.node as t.JSXIdentifier,
              )
            : null;

          refPath.replaceWith(jsxNode || mapping);
        });
      }
      return;
    }

    // Handle variable declarations
    if (t.isVariableDeclaration(runnerNode)) {
      constructAssignment(runnerNode, DeclarationType.DECLARATION, from);
      runnerNode.declarations.forEach(declarator =>
        runner(declarator, from, null),
      );
    }
    // Handle variable declarators
    else if (t.isVariableDeclarator(runnerNode)) {
      runner(runnerNode.id, from, null);
    }
    // Handle function declarations
    else if (t.isFunctionDeclaration(runnerNode)) {
      constructAssignment(runnerNode, DeclarationType.DECLARATION, from);
      if (runnerNode.id) {
        runner(runnerNode.id, from, null);
      }
    }
    // Handle object properties (e.g., function parameters)
    else if (t.isObjectProperty(runnerNode)) {
      runner(runnerNode.value, from, runnerNode);
    } else if (t.isObjectPattern(runnerNode)) {
      runnerNode.properties.forEach(
        (property: t.ObjectProperty | t.RestElement) => {
          if (t.isObjectProperty(property)) {
            runner(property.value, from, property);
          } else if (t.isRestElement(property)) {
            runner(property.argument, from, property);
          }
        },
      );
    } else if (t.isArrayPattern(runnerNode)) {
      runnerNode.elements.forEach((element: any) => {
        if (t.isRestElement(element)) {
          runner(element.argument, from, element);
        } else {
          runner(element, from, null);
        }
      });
    } else if (t.isAssignmentPattern(runnerNode)) {
      // Run the left side (e.g., `state` in `const { state = {} } = ...`)
      runner(runnerNode.left, from, null);
    }
  };

  bodyStatements?.forEach(statement => {
    runner(statement, PropStateType.STATE, null);
  });

  propsStatements?.forEach((statement: any) => {
    runner(statement, PropStateType.PROPS, null);
  });

  return {
    props: propsAssignments,
    state: stateAssignments,
  };
}

export default spreadBodyStatements;
