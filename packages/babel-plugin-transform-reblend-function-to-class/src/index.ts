import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { Visitor } from '@babel/core';
import functionToClass from './functionToClass';
import hasReblendImport from './hasReblendImport';

export default function ({
  types: t,
}: {
  types: typeof import('@babel/types');
}): { visitor: Visitor } {
  return {
    visitor: {
      Program(path: NodePath<t.Program>) {
        const reblendWorkspace = hasReblendImport(path);

        reblendWorkspace &&
          path.traverse({
            Function(functionPath) {
              functionToClass(functionPath, t);
            },
          });
      },
    },
  };
}
