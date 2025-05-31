import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { Visitor } from '@babel/core';
import functionToClass from './functionToClass';

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
            functionToClass(functionPath, t);
          },
        });
      },
    },
  };
}
