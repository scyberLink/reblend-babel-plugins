"use strict";

var Foo =
/*#__PURE__*/
function (_Reblend$Component) {
  babelHelpers.inherits(Foo, _Reblend$Component);

  function Foo() {
    babelHelpers.classCallCheck(this, Foo);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo).apply(this, arguments));
  }

  babelHelpers.createClass(Foo, [{
    key: "render",
    value: function render() {}
  }]);
  return Foo;
}(Reblend.Component);

var Getter =
/*#__PURE__*/
function (_Reblend$Component2) {
  babelHelpers.inherits(Getter, _Reblend$Component2);

  function Getter() {
    babelHelpers.classCallCheck(this, Getter);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Getter).apply(this, arguments));
  }

  babelHelpers.createClass(Getter, [{
    key: "render",
    value: function render() {}
  }, {
    key: "foo",
    get: function get() {
      return {
        foo: PropTypes.string
      };
    }
  }]);
  return Getter;
}(Reblend.Component);
