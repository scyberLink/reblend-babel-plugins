"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Foo;

var _reblend = babelHelpers.interopRequireDefault(require("reblend"));

var _underscore = require("underscore");

var _bar = babelHelpers.interopRequireDefault(require("./bar"));

var PropTypes = _reblend.default.PropTypes;
var propTypes = {
  foo: PropTypes.any
};

function Foo(props) {
  var barProps = (0, _underscore.omit)(props, Object.keys(propTypes));
  return _reblend.default.createElement(_bar.default, barProps);
}
