'use strict';
/* eslint-disable @babel/development/plugin-name */
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const development_1 = __importDefault(
  require('babel-plugin-transform-reblend-jsx/lib/development'),
);
// We need to explicitly annotate this export because
// babel-plugin-transform-reblend-jsx/lib/development has no type definitions
// (it's not a public entry point)
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
exports.default = development_1.default;
