import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { Visitor } from '@babel/core';
import functionToClass from './functionToClass';
import hasReblendHookComment from './hasReblendHookComment';
import spreadCustomHook from './spreadCustomHook';
import hasReblendImport from './hasReblendImport';

export default function ({
  types: t,
}: {
  types: typeof import('@babel/types');
}): { visitor: Visitor } {
  return {
    visitor: {
      Program(path: NodePath<t.Program>) {
        path.traverse({
          Function(functionPath) {
            const { node } = functionPath;
            if (
              hasReblendHookComment(node) ||
              hasReblendHookComment(
                functionPath?.parentPath?.parentPath?.node as t.Function,
              ) ||
              hasReblendHookComment(functionPath?.container as any) ||
              hasReblendHookComment(
                functionPath?.parentPath?.parentPath?.container as any,
              )
            ) {
              spreadCustomHook(functionPath, node, t);
            } else if (hasReblendImport(path)) {
              functionToClass(functionPath, node, t);
            }
          },
        });
      },
    },
  };
}
