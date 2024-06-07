"use strict";

var _reblend = babelHelpers.interopRequireWildcard(require("reblend"));

var Greeting =
/*#__PURE__*/
function (_Component) {
  babelHelpers.inherits(Greeting, _Component);

  function Greeting() {
    babelHelpers.classCallCheck(this, Greeting);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Greeting).apply(this, arguments));
  }

  babelHelpers.createClass(Greeting, [{
    key: "render",
    value: function render() {
      return _reblend.default.createElement("h1", null, "Hello, ", this.props.name);
    }
  }]);
  return Greeting;
}(_reblend.Component);
