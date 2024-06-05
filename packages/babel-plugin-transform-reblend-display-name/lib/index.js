'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const helper_plugin_utils_1 = require('@babel/helper-plugin-utils');
const path_1 = __importDefault(require('path'));
const core_1 = require('@babel/core');
exports.default = (0, helper_plugin_utils_1.declare)(api => {
  api.assertVersion(REQUIRED_VERSION(7));
  function addDisplayName(id, call) {
    const props = call.arguments[0].properties;
    let safe = true;
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (core_1.types.isSpreadElement(prop)) {
        continue;
      }
      const key = core_1.types.toComputedKey(prop);
      if (core_1.types.isStringLiteral(key, { value: 'displayName' })) {
        safe = false;
        break;
      }
    }
    if (safe) {
      props.unshift(
        core_1.types.objectProperty(
          core_1.types.identifier('displayName'),
          core_1.types.stringLiteral(id),
        ),
      );
    }
  }
  const isCreateClassCallExpression = core_1.types.buildMatchMemberExpression(
    'Reblend.createClass',
  );
  const isCreateClassAddon = callee =>
    core_1.types.isIdentifier(callee, { name: 'createReblendClass' });
  function isCreateClass(node) {
    if (!node || !core_1.types.isCallExpression(node)) return false;
    // not createReblendClass nor Reblend.createClass call member object
    if (
      !isCreateClassCallExpression(node.callee) &&
      !isCreateClassAddon(node.callee)
    ) {
      return false;
    }
    // no call arguments
    const args = node.arguments;
    if (args.length !== 1) return false;
    // first node arg is not an object
    const first = args[0];
    if (!core_1.types.isObjectExpression(first)) return false;
    return true;
  }
  return {
    name: 'transform-reblend-display-name',
    visitor: {
      ExportDefaultDeclaration({ node }, state) {
        if (isCreateClass(node.declaration)) {
          const filename = state.filename || 'unknown';
          let displayName = path_1.default.basename(
            filename,
            path_1.default.extname(filename),
          );
          // ./{module name}/index.js
          if (displayName === 'index') {
            displayName = path_1.default.basename(
              path_1.default.dirname(filename),
            );
          }
          addDisplayName(displayName, node.declaration);
        }
      },
      CallExpression(path) {
        const { node } = path;
        if (!isCreateClass(node)) return;
        let id;
        // crawl up the ancestry looking for possible candidates for displayName inference
        path.find(function (path) {
          if (path.isAssignmentExpression()) {
            id = path.node.left;
          } else if (path.isObjectProperty()) {
            id = path.node.key;
          } else if (path.isVariableDeclarator()) {
            id = path.node.id;
          } else if (path.isStatement()) {
            // we've hit a statement, we should stop crawling up
            return true;
          }
          // we've got an id! no need to continue
          if (id) return true;
        });
        // ensure that we have an identifier we can inherit from
        if (!id) return;
        // foo.bar -> bar
        if (core_1.types.isMemberExpression(id)) {
          id = id.property;
        }
        // identifiers are the only thing we can reliably get a name from
        if (core_1.types.isIdentifier(id)) {
          addDisplayName(id.name, node);
        }
      },
    },
  };
});
