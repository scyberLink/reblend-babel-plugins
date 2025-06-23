import { accumulateAttribute, getTag, get } from './utils';
import * as t from '@babel/types';
import type { PluginPass, NodePath } from '@babel/core';
import type {
  JSXFragment,
  JSXElement,
  JSXAttribute,
  JSXSpreadAttribute,
  ObjectExpression,
  CallExpression,
} from '@babel/types';
import { REBLEND_CONSTRUCT_ID, REBLEND_IMPORT_NAME_ID } from './constants';

// Builds JSX Fragment <></> into
// Reblend.construct(Reblend, null, ...children)
export function createFragmentConstructCall(
  path: NodePath<JSXFragment>,
  file: PluginPass,
) {
  return call(file, REBLEND_CONSTRUCT_ID, [
    get(file, REBLEND_IMPORT_NAME_ID), // use the actual AST node, not t.identifier
    t.nullLiteral(),
    ...t.react.buildChildren(path.node),
  ]);
}

/**
 * The logic for this is quite terse. It's because we need to
 * support spread elements. We loop over all attributes,
 * breaking on spreads, we then push a new object containing
 * all prior attributes to an array for later processing.
 */
export function createPropsObjectFromAttributes(
  file: PluginPass,
  path: NodePath<JSXElement>,
  attribs: NodePath<JSXAttribute | JSXSpreadAttribute>[],
) {
  const props: ObjectExpression['properties'] = [];
  const found = Object.create(null);

  for (const attr of attribs) {
    const { node } = attr;
    const name =
      t.isJSXAttribute(node) && t.isJSXIdentifier(node.name) && node.name.name;
    accumulateAttribute(props, attr);
  }

  return props.length === 1 &&
    t.isSpreadElement(props[0]) &&
    // If an object expression is spread element's argument
    // it is very likely to contain __proto__ and we should stop
    // optimizing spread element
    !t.isObjectExpression(props[0].argument)
    ? props[0].argument
    : props.length > 0
      ? t.objectExpression(props)
      : t.nullLiteral();
}

// Builder
// Builds JSX into:
// Production: Reblend.construct(type, arguments, children)
// Development: Reblend.construct(type, arguments, children, source, self)
export function createElementConstructCall(
  path: NodePath<JSXElement>,
  file: PluginPass,
) {
  const openingPath = path.get('openingElement');

  return call(file, REBLEND_CONSTRUCT_ID, [
    getTag(openingPath),
    createPropsObjectFromAttributes(file, path, openingPath.get('attributes')),
    // @ts-expect-error JSXSpreadChild has been transformed in convertAttributeValue
    ...t.react.buildChildren(path.node),
  ]);
}

function call(
  pass: PluginPass,
  name: string,
  args: CallExpression['arguments'],
) {
  const construct = get(pass, name);
  const node = t.callExpression(construct(), args);
  return node;
}
