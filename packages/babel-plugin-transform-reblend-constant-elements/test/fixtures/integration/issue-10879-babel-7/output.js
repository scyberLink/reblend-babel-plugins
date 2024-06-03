'use strict';

var _reblend = babelHelpers.interopRequireDefault(require('reblend'));
var namespace = {
  MyComponent: function MyComponent(props) {
    return props.name;
  },
};
var buildTest = function buildTest(name) {
  var _MyComponent;
  var MyComponent = namespace.MyComponent;
  return function () {
    return (
      _MyComponent ||
      (_MyComponent = /*#__PURE__*/ _reblend['default'].createElement(
        MyComponent,
        {
          name: name,
        }
      ))
    );
  };
};
