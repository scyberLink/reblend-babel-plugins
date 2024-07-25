import * as t from '@babel/types';

const addAssignmentStatements = (
  t: typeof import('@babel/types'),
  declarations: t.VariableDeclarator[],
): t.ExpressionStatement[] => {
  const assignmentStatements: t.ExpressionStatement[] = [];

  declarations.forEach(declaration => {
    if (t.isArrowFunctionExpression(declaration.init)) {
      assignmentStatements.push(
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(t.thisExpression(), declaration.id as any),
            t.callExpression(
              t.memberExpression(declaration.id as any, t.identifier('bind')),
              [t.thisExpression()],
            ),
          ),
        ),
      );
    } else if (t.isFunctionExpression(declaration.init)) {
      assignmentStatements.push(
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(t.thisExpression(), declaration.id as any),
            t.callExpression(
              t.memberExpression(declaration.id as any, t.identifier('bind')),
              [t.thisExpression()],
            ),
          ),
        ),
      );
    } else if (t.isIdentifier(declaration.id)) {
      assignmentStatements.push(
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(t.thisExpression(), declaration.id),
            declaration.id,
          ),
        ),
      );
    } else if (t.isArrayPattern(declaration.id)) {
      // Extract the variables declared in the ArrayPattern
      declaration.id.elements.forEach(element => {
        if (t.isIdentifier(element)) {
          assignmentStatements.push(
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.thisExpression(), element),
                element,
              ),
            ),
          );
        }
      });
    } else if (t.isObjectPattern(declaration.id)) {
      // Extract the variables declared in the ObjectPattern
      declaration.id.properties.forEach(property => {
        if (t.isObjectProperty(property) && t.isIdentifier(property.value)) {
          assignmentStatements.push(
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.thisExpression(), property.value),
                property.value,
              ),
            ),
          );
        }
      });
    }
  });

  return assignmentStatements;
};

export default addAssignmentStatements;
