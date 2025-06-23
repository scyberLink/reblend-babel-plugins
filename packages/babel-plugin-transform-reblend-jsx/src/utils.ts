import type { PluginPass, NodePath } from '@babel/core';
import * as t from '@babel/types';
import type {
  ObjectExpression,
  JSXAttribute,
  JSXSpreadAttribute,
  JSXOpeningElement,
  Class,
  Identifier,
  CallExpression,
} from '@babel/types';

// Plugin state helpers
export const get = (pass: PluginPass, name: string) =>
  pass.get(`babel-plugin-reblend-jsx/${name}`);
export const set = (pass: PluginPass, name: string, v: any) =>
  pass.set(`babel-plugin-reblend-jsx/${name}`, v);

// Utility: Check for __proto__ property in object expressions
function hasProto(node: t.ObjectExpression) {
  return node.properties.some(
    value =>
      t.isObjectProperty(value, { computed: false, shorthand: false }) &&
      (t.isIdentifier(value.key, { name: '__proto__' }) ||
        t.isStringLiteral(value.key, { value: '__proto__' })),
  );
}

// Converts JSX identifier/member/namespace to Babel AST node
function convertJSXIdentifier(
  node: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName,
  parent: t.JSXOpeningElement | t.JSXMemberExpression,
): t.ThisExpression | t.StringLiteral | t.MemberExpression | t.Identifier {
  if (t.isJSXIdentifier(node)) {
    if (node.name === 'this' && t.isReferenced(node, parent)) {
      return t.thisExpression();
    } else if (t.isValidIdentifier(node.name, false)) {
      // @ts-expect-error cast AST type to Identifier
      node.type = 'Identifier';
      return node as unknown as t.Identifier;
    } else {
      return t.stringLiteral(node.name);
    }
  } else if (t.isJSXMemberExpression(node)) {
    return t.memberExpression(
      convertJSXIdentifier(node.object, node),
      convertJSXIdentifier(node.property, node),
    );
  } else if (t.isJSXNamespacedName(node)) {
    // If the flag "throwIfNamespace" is false, print XMLNamespace like string literal
    return t.stringLiteral(`${node.namespace.name}:${node.name.name}`);
  }
  // todo: this branch should be unreachable
  return node;
}

// Converts JSX attribute value to Babel AST node
function convertAttributeValue(
  node: t.JSXAttribute['value'] | t.BooleanLiteral,
) {
  if (t.isJSXExpressionContainer(node)) {
    return node.expression;
  } else {
    return node;
  }
}

// Accumulates JSX attributes and spreads into an object properties array
export function accumulateAttribute(
  array: ObjectExpression['properties'],
  attribute: NodePath<JSXAttribute | JSXSpreadAttribute>,
) {
  if (t.isJSXSpreadAttribute(attribute.node)) {
    const arg = attribute.node.argument;
    // Collect properties into props array if spreading object expression
    if (t.isObjectExpression(arg) && !hasProto(arg)) {
      array.push(...arg.properties);
    } else {
      array.push(t.spreadElement(arg));
    }
    return array;
  }

  const value = convertAttributeValue(
    attribute.node.name.name !== 'key'
      ? attribute.node.value || t.booleanLiteral(true)
      : attribute.node.value,
  );

  if (attribute.node.name.name === 'key' && value === null) {
    throw attribute.buildCodeFrameError(
      'Please provide an explicit key value. Using "key" as a shorthand for "key={true}" is not allowed.',
    );
  }

  if (
    t.isStringLiteral(value) &&
    !t.isJSXExpressionContainer(attribute.node.value)
  ) {
    value.value = value.value.replace(/\n\s+/g, ' ');
    // "raw" JSXText should not be used from a StringLiteral because it needs to be escaped.
    delete value.extra?.raw;
  }

  if (t.isJSXNamespacedName(attribute.node.name)) {
    // @ts-expect-error mutating AST
    attribute.node.name = t.stringLiteral(
      attribute.node.name.namespace.name + ':' + attribute.node.name.name.name,
    );
  } else if (t.isValidIdentifier(attribute.node.name.name, false)) {
    // @ts-expect-error mutating AST
    attribute.node.name.type = 'Identifier';
  } else {
    // @ts-expect-error mutating AST
    attribute.node.name = t.stringLiteral(attribute.node.name.name);
  }

  array.push(
    t.inherits(
      t.objectProperty(
        // @ts-expect-error The attribute.node.name is an Identifier now
        attribute.node.name,
        value,
      ),
      attribute.node,
    ),
  );
  return array;
}

// Gets the tag for a JSX opening element (string or identifier)
export function getTag(openingPath: NodePath<JSXOpeningElement>) {
  const tagExpr = convertJSXIdentifier(openingPath.node.name, openingPath.node);

  let tagName: string;
  if (t.isIdentifier(tagExpr)) {
    tagName = tagExpr.name;
  } else if (t.isStringLiteral(tagExpr)) {
    tagName = tagExpr.value;
  }

  if (t.react.isCompatTag(tagName)) {
    return t.stringLiteral(tagName);
  } else {
    return tagExpr;
  }
}
