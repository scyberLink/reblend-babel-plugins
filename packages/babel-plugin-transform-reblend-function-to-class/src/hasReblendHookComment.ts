import * as t from '@babel/types';

function hasReblendHookComment(node: t.Function) {
  if (node?.leadingComments) {
    return node?.leadingComments?.some(
      comment => comment.value.trim().toLowerCase() === '@reblendhook',
    );
  }
  return false;
}

export default hasReblendHookComment;
