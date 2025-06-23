import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

// Helper to find the local name for reblendjs import/require/__importStar
export function findReblendImportName(
  path: NodePath<t.Function> | NodePath<t.Program>,
): t.Identifier | t.MemberExpression {
  let importName = 'Reblend'; // default fallback

  const program = path.isProgram()
    ? path
    : (path.findParent(p => p.isProgram()) as NodePath<t.Program>);
  if (!program) return t.identifier('Reblend');

  for (const node of program.node.body) {
    if (
      t.isImportDeclaration(node) &&
      node.source.value === 'reblendjs' &&
      node.specifiers.length > 0
    ) {
      const defaultImport = node.specifiers.find(s =>
        t.isImportDefaultSpecifier(s),
      );
      if (defaultImport && t.isIdentifier(defaultImport.local)) {
        return defaultImport.local;
      }
      const namedImport = node.specifiers.find(
        s =>
          t.isImportSpecifier(s) &&
          t.isIdentifier(s.imported, { name: 'Reblend' }),
      );
      if (namedImport && t.isImportSpecifier(namedImport)) {
        return namedImport.local;
      }
      // Handle import * as Reblend from 'reblendjs'
      const namespaceImport = node.specifiers.find(s =>
        t.isImportNamespaceSpecifier(s),
      );
      if (namespaceImport && t.isImportNamespaceSpecifier(namespaceImport)) {
        // Return Reblend.Reblend
        return t.memberExpression(
          namespaceImport.local,
          t.identifier('Reblend'),
        );
      }
    }
    // CJS: const Reblend = require('reblendjs')
    if (t.isVariableDeclaration(node)) {
      for (const decl of node.declarations) {
        if (
          t.isVariableDeclarator(decl) &&
          t.isCallExpression(decl.init) &&
          t.isIdentifier(decl.init.callee, { name: 'require' }) &&
          decl.init.arguments.length === 1 &&
          t.isStringLiteral(decl.init.arguments[0], { value: 'reblendjs' }) &&
          t.isIdentifier(decl.id)
        ) {
          // return MemberExpression: Reblend.construct
          return t.memberExpression(decl.id, t.identifier('Reblend'));
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
          // return MemberExpression: reblendjs_1.Reblend
          return t.memberExpression(decl.id, t.identifier('Reblend'));
        }
      }
    }
  }
  // fallback: Identifier('Reblend')
  return t.identifier('Reblend');
}
