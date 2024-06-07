"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reblend = babelHelpers.interopRequireWildcard(require("reblendjs"));

var Greeting =
/*#__PURE__*/
function (_Component) {
  babelHelpers.inherits(Greeting, _Component);

  function Greeting(props, context) {
    var _this;

    babelHelpers.classCallCheck(this, Greeting);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Greeting).call(this, props, context));
    var appName = context.store.getState().appName;
    _this.state = {
      appName: appName
    };
    return _this;
  }

  babelHelpers.createClass(Greeting, [{
    key: "render",
    value: function render() {
      return _reblend.default.construct("h1", null, "Welcome ", this.props.name, " and ", this.props.friends.join(', '), " to ", this.state.appName);
    }
  }]);
  return Greeting;
}(_reblend.Component);

exports.default = Greeting;
