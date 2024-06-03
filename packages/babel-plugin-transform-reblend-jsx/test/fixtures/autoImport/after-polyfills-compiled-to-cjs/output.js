"use strict";

require("reblend-app-polyfill/ie11");
require("reblend-app-polyfill/stable");
var _reblendDom = babelHelpers.interopRequireDefault(require("reblend-dom"));
var _jsxRuntime = require("reblend/jsx-runtime");
// https://github.com/babel/babel/issues/12522

_reblendDom.default.render( /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
  children: "Hello, World!"
}), document.getElementById('root'));
