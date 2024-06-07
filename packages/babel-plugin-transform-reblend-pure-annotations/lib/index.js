'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const helper_plugin_utils_1 = require('@babel/helper-plugin-utils');
const helper_annotate_as_pure_1 = __importDefault(
  require('@babel/helper-annotate-as-pure'),
);
const core_1 = require('@babel/core');
// Mapping of Reblend top-level methods that are pure.
// This plugin adds a /*#__PURE__#/ annotation to calls to these methods,
// so that terser and other minifiers can safely remove them during dead
// code elimination.
// See https://reblendjs.org/docs/reblend-api.html
const PURE_CALLS = [
  [
    'reblend',
    new Set([
      'cloneElement',
      'createContext',
      'createElement',
      'createFactory',
      'createRef',
      'forwardRef',
      'isValidElement',
      'memo',
      'lazy',
    ]),
  ],
  ['reblend-dom', new Set(['createPortal'])],
];
exports.default = (0, helper_plugin_utils_1.declare)(api => {
  api.assertVersion(REQUIRED_VERSION(7));
  return {
    name: 'transform-reblend-pure-annotations',
    visitor: {
      CallExpression(path) {
        if (isReblendCall(path)) {
          (0, helper_annotate_as_pure_1.default)(path);
        }
      },
    },
  };
});
function isReblendCall(path) {
  // If the callee is not a member expression, then check if it matches
  // a named import, e.g. `import {forwardRef} from 'reblend'`.
  const calleePath = path.get('callee');
  if (!calleePath.isMemberExpression()) {
    for (const [module, methods] of PURE_CALLS) {
      for (const method of methods) {
        if (calleePath.referencesImport(module, method)) {
          return true;
        }
      }
    }
    return false;
  }
  // Otherwise, check if the member expression's object matches
  // a default import (`import Reblend from 'reblend'`) or namespace
  // import (`import * as Reblend from 'reblend'), and check if the
  // property matches one of the pure methods.
  const object = calleePath.get('object');
  const callee = calleePath.node;
  if (!callee.computed && core_1.types.isIdentifier(callee.property)) {
    const propertyName = callee.property.name;
    for (const [module, methods] of PURE_CALLS) {
      if (
        object.referencesImport(module, 'default') ||
        object.referencesImport(module, '*')
      ) {
        return methods.has(propertyName);
      }
    }
  }
  return false;
}
