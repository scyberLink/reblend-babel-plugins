import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

export function hasReblendComment(commentSuffix: string, path: NodePath) {
  if (!commentSuffix || !path) {
    return false;
  }

  commentSuffix = commentSuffix.toLowerCase();

  const hasIt = (node: t.Node) => {
    if (node?.leadingComments) {
      return node?.leadingComments?.some(comment =>
        comment.value
          .trim()
          .toLowerCase()
          .startsWith(`@reblend${commentSuffix}`),
      );
    }
    return false;
  };

  const { node } = path;

  return (
    hasIt(node) ||
    hasIt(path?.parentPath?.parentPath?.node as t.Function) ||
    hasIt(path?.container as any) ||
    hasIt(path?.parentPath?.parentPath?.container as any)
  );
}
