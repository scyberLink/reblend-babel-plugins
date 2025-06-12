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
  const stateAssignments: t.ExpressionStatement[] = [];
  const propsAssignments: t.ExpressionStatement[] = [];
  const assignmentPaths = new Set<NodePath<t.AssignmentExpression>>();

  // Collect all assignment expressions in the current scope
  path.scope.path.traverse({
    AssignmentExpression(assignmentPath) {
      assignmentPaths.add(assignmentPath);
    },
  });

  // Track assignments that need to be replaced with member expressions
  const replaceableAssignmentPaths: {
    assignmentPath: NodePath<t.AssignmentExpression>;
    mapping: t.MemberExpression;
  }[] = [];

  /**
   * Adds a variable or assignment to the correct assignments array.
   */
  const addAssignment = (
    node: t.Node,
    declarationType: DeclarationType,
    from: PropStateType,
  ) => {
    let assignment: t.Statement | undefined;

    switch (declarationType) {
      case DeclarationType.ARRAY_PATTERN:
      case DeclarationType.OBJECT_PATTERN:
        // Destructuring handled elsewhere
        break;
      case DeclarationType.DECLARATION:
      default:
        assignment = node as t.Statement;
        break;
    }

    if (assignment) {
      if (from === PropStateType.STATE) {
        stateAssignments.push(assignment as t.ExpressionStatement);
      } else if (from === PropStateType.PROPS) {
        propsAssignments.push(assignment as t.ExpressionStatement);
      }
    }
  };

  /**
   * Recursively processes nodes to map identifiers, destructuring, and assignments
   * to this.state or this.props as appropriate.
   */
  const processNode = (
    node: t.Node,
    from: PropStateType,
    parent: t.Node | null,
  ) => {
    // Handle identifiers (simple variable names)
    if (t.isIdentifier(node)) {
      let memberExpr: t.MemberExpression | null = null;

      // Map identifier to this.state or this.props
      switch (from) {
        case PropStateType.STATE:
          memberExpr = t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier('state')),
            node,
          );
          break;
        case PropStateType.PROPS:
          memberExpr = t.memberExpression(
            t.thisExpression(),
            parent ? t.identifier('props') : node,
          );
          break;
        default:
          break;
      }

      // If the identifier is part of an object property, map to this.props.key
      let memberExprWithKey: t.MemberExpression | undefined;
      if (
        t.isObjectProperty(parent) &&
        memberExpr &&
        from === PropStateType.PROPS
      ) {
        memberExprWithKey = t.memberExpression(memberExpr, parent.key);
      }

      // Use the most specific mapping
      const finalMapping: t.MemberExpression = memberExprWithKey || memberExpr!;

      // Handle rest elements in destructuring (e.g., ...rest)
      let assignmentStmt: t.ExpressionStatement;
      if (
        t.isRestElement(parent) &&
        memberExpr &&
        from === PropStateType.PROPS
      ) {
        // For rest, create an assignment with object spread
        assignmentStmt = t.expressionStatement(
          t.assignmentExpression(
            '=',
            finalMapping,
            t.objectExpression([
              t.spreadElement(finalMapping),
              t.spreadElement(node),
            ]),
          ),
        );
      } else {
        // Simple assignment
        assignmentStmt = t.expressionStatement(
          t.assignmentExpression('=', finalMapping, node),
        );
      }

      // Add assignment to the correct array
      if (from === PropStateType.STATE) {
        stateAssignments.push(assignmentStmt);
      } else if (from === PropStateType.PROPS) {
        propsAssignments.push(assignmentStmt);
      }

      // Replace all references to the identifier in the scope with the mapped member expression
      const varName = node.name;
      const binding = path.scope.getBinding(varName);

      if (binding) {
        binding.referencePaths.forEach(refPath => {
          // Skip TypeScript type nodes
          if (
            t.isTSType(refPath.parent) ||
            t.isTSTypeAnnotation(refPath.parent) ||
            t.isTSTypeReference(refPath.parent) ||
            t.isTSTypeQuery(refPath.parent) ||
            t.isTSImportType(refPath.parent) ||
            t.isTSInterfaceDeclaration(refPath.parent) ||
            t.isTSEnumDeclaration(refPath.parent) ||
            t.isTSModuleDeclaration(refPath.parent) ||
            t.isTSAsExpression(refPath.parent) ||
            t.isTSNonNullExpression(refPath.parent) ||
            t.isTSParameterProperty(refPath.parent) ||
            t.isTSDeclareFunction(refPath.parent) ||
            t.isTSDeclareMethod(refPath.parent)
          ) {
            return;
          }

          let jsxReplacement:
            | t.JSXMemberExpression
            | t.MemberExpression
            | null = null;
          if (t.isJSXIdentifier(refPath.node as t.JSXIdentifier)) {
            // Replace JSX usage with this.state.var or this.props.var
            switch (from) {
              case PropStateType.STATE:
                jsxReplacement = t.jSXMemberExpression(
                  t.jSXMemberExpression(
                    t.jsxIdentifier('this'),
                    t.jsxIdentifier('state'),
                  ),
                  refPath.node as t.JSXIdentifier,
                );
                break;
              case PropStateType.PROPS:
                jsxReplacement = t.jSXMemberExpression(
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
          refPath.replaceWith(jsxReplacement || finalMapping);
        });

        // Replace assignments to the identifier with assignments to the member expression
        assignmentPaths.forEach(assignmentPath => {
          const { left } = assignmentPath.node;
          const assignmentBinding = assignmentPath.scope.getBinding(varName);

          // Only replace if the assignment is in the same scope as the original identifier
          if (
            assignmentBinding === binding &&
            t.isIdentifier(left, { name: varName })
          ) {
            replaceableAssignmentPaths.push({
              assignmentPath,
              mapping: finalMapping,
            });
            assignmentPaths.delete(assignmentPath);
          }
        });
      }
      return;
    }

    // Handle variable declarations (e.g., const { a } = ...)
    if (t.isVariableDeclaration(node)) {
      addAssignment(node, DeclarationType.DECLARATION, from);
      node.declarations.forEach(
        declarator => declarator && processNode(declarator, from, null),
      );
    }
    // Handle variable declarators (e.g., { a } = ...)
    else if (t.isVariableDeclarator(node)) {
      processNode(node.id, from, null);
    }
    // Handle function declarations (convert to arrow function and preserve comments)
    else if (t.isFunctionDeclaration(node)) {
      const arrowFunction = t.arrowFunctionExpression(
        node.params,
        node.body,
        node.async,
      );
      arrowFunction.leadingComments = node.leadingComments;
      arrowFunction.innerComments = node.innerComments;
      arrowFunction.trailingComments = node.trailingComments;

      const variableDeclarator = t.variableDeclarator(node.id!, arrowFunction);
      const variableDeclaration = t.variableDeclaration('const', [
        variableDeclarator,
      ]);

      addAssignment(variableDeclaration, DeclarationType.DECLARATION, from);

      if (node.id) {
        processNode(node.id, from, null);
      }
    }
    // Handle object properties (recursively process the value)
    else if (t.isObjectProperty(node)) {
      processNode(node.value, from, node);
    }
    // Handle object patterns (destructuring: const { a, ...rest } = ...)
    else if (t.isObjectPattern(node)) {
      node.properties.forEach((property: t.ObjectProperty | t.RestElement) => {
        if (property) {
          if (t.isObjectProperty(property)) {
            processNode(property.value, from, property);
          } else if (t.isRestElement(property)) {
            // Rest element in object pattern (e.g., ...rest)
            processNode(property.argument, from, property);
          }
        }
      });
    }
    // Handle array patterns (destructuring: const [a, ...rest] = ...)
    else if (t.isArrayPattern(node)) {
      // Each element in node.elements is either a Pattern or null
      node.elements.forEach((element, idx) => {
        if (!element) return;
        if (t.isRestElement(element)) {
          // Rest element in array pattern (e.g., ...rest)
          // element.argument is a Pattern
          processNode(element.argument, from, element);
        } else if (
          t.isIdentifier(element) ||
          t.isAssignmentPattern(element) ||
          t.isArrayPattern(element) ||
          t.isObjectPattern(element) ||
          t.isMemberExpression(element)
        ) {
          // Regular element in array pattern
          // For parent, we pass null since objectProperty is not valid here
          processNode(element, from, null);
        }
        // Other node types (e.g., null) are ignored
      });
    }
    // Handle assignment patterns (default values: const a = b)
    else if (t.isAssignmentPattern(node)) {
      processNode(node.left, from, parent);
    }
    // Fallback: treat as a declaration
    else {
      addAssignment(node, DeclarationType.DECLARATION, from);
    }
  };

  // Process state-related statements
  bodyStatements?.forEach(statement => {
    processNode(statement, PropStateType.STATE, null);
  });

  // Process props-related statements
  propsStatements?.forEach((statement: t.Statement) => {
    processNode(statement, PropStateType.PROPS, null);
  });

  // Replace assignment expressions with member expressions
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
