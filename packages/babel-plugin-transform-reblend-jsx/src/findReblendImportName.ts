import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

// Helper to find the local name for reblendjs import/require/__importStar
export function findReblendImportName(
  path: NodePath<t.Function> | NodePath<t.Program>,
): string {
  let importName = 'Reblend'; // default fallback

  const program = path.isProgram()
    ? path
    : (path.findParent(p => p.isProgram()) as NodePath<t.Program>);
  if (!program) return importName;

  for (const node of program.node.body) {
    // ESM: import Reblend from 'reblendjs'
    if (
      t.isImportDeclaration(node) &&
      node.source.value === 'reblendjs' &&
      node.specifiers.length > 0
    ) {
      // Default import: import Reblend from 'reblendjs'
      const defaultImport = node.specifiers.find(s =>
        t.isImportDefaultSpecifier(s),
      );
      if (defaultImport && t.isIdentifier(defaultImport.local)) {
        return defaultImport.local.name;
      }

      // Named import: import { Reblend } from 'reblendjs'
      const namedImport = node.specifiers.find(
        s =>
          t.isImportSpecifier(s) &&
          t.isIdentifier(s.imported, { name: 'Reblend' }),
      );
      if (namedImport && t.isImportSpecifier(namedImport)) {
        // Handle alias: import { Reblend as R } from 'reblendjs'
        return namedImport.local.name;
      }
    }
    // CJS: const Reblend = require('reblendjs')
    if (t.isVariableDeclaration(node)) {
      for (const decl of node.declarations) {
        // const Reblend = require('reblendjs')
        if (
          t.isVariableDeclarator(decl) &&
          t.isCallExpression(decl.init) &&
          t.isIdentifier(decl.init.callee, { name: 'require' }) &&
          decl.init.arguments.length === 1 &&
          t.isStringLiteral(decl.init.arguments[0], { value: 'reblendjs' }) &&
          t.isIdentifier(decl.id)
        ) {
          return `${decl.id.name}.Reblend`;
        }
        // const reblendjs_1 = __importStar(require("reblendjs"))
        if (
          t.isVariableDeclarator(decl) &&
          t.isCallExpression(decl.init) &&
          t.isIdentifier(decl.init.callee, { name: '__importStar' }) &&
          decl.init.arguments.length === 1 &&
          t.isCallExpression(decl.init.arguments[0]) &&
          t.isIdentifier(decl.init.arguments[0].callee, { name: 'require' }) &&
          decl.init.arguments[0].arguments.length === 1 &&
          t.isStringLiteral(decl.init.arguments[0].arguments[0], {
            value: 'reblendjs',
          }) &&
          t.isIdentifier(decl.id)
        ) {
          // Return the namespace import variable, e.g. "reblendjs_1"
          // You will likely need to use `${namespace}.Reblend` as the pragma
          return `${decl.id.name}.Reblend`;
        }
      }
    }
  }
  return importName;
}
