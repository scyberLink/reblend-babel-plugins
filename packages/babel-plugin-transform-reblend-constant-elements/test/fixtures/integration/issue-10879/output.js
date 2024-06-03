"use strict";

var _reblend = babelHelpers.interopRequireDefault(require("reblend"));
var _jsxRuntime = require("reblend/jsx-runtime");
const namespace = {
  MyComponent: props => props.name
};
const buildTest = name => {
  var _MyComponent;
  const {
    MyComponent
  } = namespace;
  return () => _MyComponent || (_MyComponent = /*#__PURE__*/(0, _jsxRuntime.jsx)(MyComponent, {
    name: name
  }));
};
