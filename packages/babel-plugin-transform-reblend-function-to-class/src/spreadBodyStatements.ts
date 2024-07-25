import * as t from '@babel/types';
import addAssignmentStatements from './addAssignmentStatements';

function spreadBodyStatements(
  bodyStatements: t.Statement[],
): t.ExpressionStatement[] {
  return bodyStatements
    .map(statement => {
      if (t.isVariableDeclaration(statement)) {
        return [
          statement,
          ...addAssignmentStatements(t, statement.declarations),
        ];
      } else if (t.isFunctionDeclaration(statement)) {
        return [
          statement,
          t.expressionStatement(
            t.assignmentExpression(
              '=',
              t.memberExpression(t.thisExpression(), statement.id as any),
              t.callExpression(
                t.memberExpression(statement.id as any, t.identifier('bind')),
                [t.thisExpression()],
              ),
            ),
          ),
        ];
      } else {
        return [statement];
      }
    })
    .flat(Number.MAX_SAFE_INTEGER)
    .filter(Boolean) as t.ExpressionStatement[];
}

export default spreadBodyStatements;
