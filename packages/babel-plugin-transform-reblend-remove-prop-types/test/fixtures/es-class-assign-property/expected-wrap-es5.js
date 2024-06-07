"use strict";

var Foo1 =
/*#__PURE__*/
function (_Reblend$Component) {
  babelHelpers.inherits(Foo1, _Reblend$Component);

  function Foo1() {
    babelHelpers.classCallCheck(this, Foo1);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo1).apply(this, arguments));
  }

  babelHelpers.createClass(Foo1, [{
    key: "render",
    value: function render() {}
  }]);
  return Foo1;
}(Reblend.Component);

Foo1.propTypes = process.env.NODE_ENV !== "production" ? {
  bar1: PropTypes.string
} : {};

var Foo2 =
/*#__PURE__*/
function (_Reblend$PureComponent) {
  babelHelpers.inherits(Foo2, _Reblend$PureComponent);

  function Foo2() {
    babelHelpers.classCallCheck(this, Foo2);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo2).apply(this, arguments));
  }

  babelHelpers.createClass(Foo2, [{
    key: "render",
    value: function render() {}
  }]);
  return Foo2;
}(Reblend.PureComponent);

Foo2.propTypes = process.env.NODE_ENV !== "production" ? {
  bar2: PropTypes.string
} : {};
