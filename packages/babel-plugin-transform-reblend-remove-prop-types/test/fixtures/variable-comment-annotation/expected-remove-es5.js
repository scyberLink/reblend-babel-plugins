"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reblend = babelHelpers.interopRequireDefault(require("reblend"));

var _propTypes = babelHelpers.interopRequireDefault(require("prop-types"));

var _reblendRedux = require("reblend-redux");

var _FooComponent = babelHelpers.interopRequireDefault(require("./FooComponent"));

var Foo = (0, _reblendRedux.connect)(function () {}, function () {})(_FooComponent.default);
var _default = Foo;
exports.default = _default;
