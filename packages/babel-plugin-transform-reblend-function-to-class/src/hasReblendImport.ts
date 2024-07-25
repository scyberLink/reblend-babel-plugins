import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

function hasReblendImport(path: NodePath<t.Program>) {
  let hasImport = false;

  path.traverse({
    ImportDeclaration(importPath) {
      if (importPath.node.source.value === 'reblendjs') {
        hasImport = true;
        importPath.stop();
      }
    },
  });

  return hasImport;
}

export default hasReblendImport;
