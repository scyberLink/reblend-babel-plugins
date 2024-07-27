import * as t from '@babel/types';

function hasReblendComponentComment(node: t.Function) {
  if (node?.leadingComments) {
    return node?.leadingComments?.some(
      comment => comment.value.trim().toLowerCase() === '@reblendcomponent',
    );
  }
  return false;
}

export default hasReblendComponentComment;
