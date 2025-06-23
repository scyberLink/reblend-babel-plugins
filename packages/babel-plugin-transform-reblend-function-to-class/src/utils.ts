import * as t from '@babel/types';
import type { PluginPass, NodePath } from '@babel/core';

export const REBLEND_IMPORT_NAME_ID = 'id/REBLEND_IMPORT_NAME_ID';
export const TRANSFORMED_COMMENT =
  ' @Reblend: Transformed from function to class ';

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

export function getProps(node: t.Function) {
  return node.params || []; /* .length < 1
    ? []
    : t.isObjectPattern(node.params[0])
      ? (node.params[0] as t.ObjectPattern).properties
      : [node.params[0]]; */
}

// Helper to find the local name for reblendjs import/require/__importStar
export function findReblendImportName(
  path: NodePath<t.Function> | NodePath<t.Program>,
): t.Identifier | t.MemberExpression {
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

export const isComponentName = (functionName: string) =>
  !!functionName && /^[A-Z][A-Za-z0-9_]*$/.test(functionName);

export const isHookName = (functionName: string) =>
  functionName &&
  functionName.startsWith('use') &&
  functionName[3] &&
  functionName[3] === functionName[3]?.toUpperCase();

// Plugin state helpers
export const get = (pass: PluginPass, name: string) =>
  pass.get(`babel-plugin-transform-reblend-function-to-class/${name}`);
export const set = (pass: PluginPass, name: string, v: any) =>
  pass.set(`babel-plugin-transform-reblend-function-to-class/${name}`, v);

export const isTypescriptNode = (node: t.Node): node is t.TSType =>
  t.isTSType(node) ||
  t.isTSTypeAnnotation(node) ||
  t.isTSTypeParameterDeclaration(node) ||
  t.isTSTypeParameterInstantiation(node) ||
  t.isTSParameterProperty(node) ||
  t.isTSDeclareFunction(node) ||
  t.isTSInterfaceDeclaration(node) ||
  t.isTSTypeAliasDeclaration(node) ||
  t.isTSModuleDeclaration(node) ||
  t.isTSTypeReference(node) ||
  t.isTSTypeQuery(node) ||
  t.isTSImportType(node) ||
  t.isTSEnumDeclaration(node) ||
  t.isTSAsExpression(node) ||
  //t.isTSNonNullExpression(node) ||
  t.isTSDeclareMethod(node);
