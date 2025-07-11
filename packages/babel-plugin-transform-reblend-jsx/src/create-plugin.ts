import jsx from '@babel/plugin-syntax-jsx';
import { declare } from '@babel/helper-plugin-utils';
import { types as t } from '@babel/core';
import type { PluginPass } from '@babel/core';
import { findReblendImportName } from './findReblendImportName';
import { get, set } from './utils';
import {
  REBLEND_CONSTRUCT_ID,
  REBLEND_FRAGMENT_ID,
  REBLEND_IMPORT_NAME_ID,
} from './constants';
import {
  createElementConstructCall,
  createFragmentConstructCall,
} from './factory';

export interface Options {
  filter?: (node: t.Node, pass: PluginPass) => boolean;
  importSource?: string;
  pragma?: string;
  pragmaFrag?: string;
  pure?: string;
  throwIfNamespace?: boolean;
}
export default function createPlugin({
  name,
  development,
}: {
  name: string;
  development: boolean;
}) {
  return declare((_, options: Options) => {
    return {
      name,
      inherits: jsx,
      visitor: {
        Program: {
          enter(path, state) {
            let reblendImportNode = get(state, REBLEND_IMPORT_NAME_ID);
            if (!reblendImportNode) {
              reblendImportNode = findReblendImportName(path); // now returns AST node
              set(state, REBLEND_IMPORT_NAME_ID, reblendImportNode);
            }
            // Use the actual AST node for Reblend import
            const construct = t.callExpression(
              t.memberExpression(
                t.memberExpression(
                  reblendImportNode,
                  t.identifier('construct'),
                ),
                t.identifier('bind'),
              ),
              [t.thisExpression()],
            );
            const fragment = t.cloneNode(reblendImportNode);

            set(state, REBLEND_CONSTRUCT_ID, () => t.cloneNode(construct));
            set(state, REBLEND_FRAGMENT_ID, () => t.cloneNode(fragment));
          },
        },

        JSXFragment: {
          exit(path, file) {
            let callExpr = createFragmentConstructCall(path, file);
            path.replaceWith(t.inherits(callExpr, path.node));
          },
        },

        JSXElement: {
          exit(path, file) {
            let callExpr = createElementConstructCall(path, file);
            path.replaceWith(t.inherits(callExpr, path.node));
          },
        },

        JSXAttribute(path) {
          if (t.isJSXElement(path.node.value)) {
            path.node.value = t.jsxExpressionContainer(path.node.value);
          }
        },
      },
    };
  });
}
