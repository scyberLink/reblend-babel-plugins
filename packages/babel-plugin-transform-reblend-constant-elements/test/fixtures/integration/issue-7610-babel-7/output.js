'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;
var _Parent = babelHelpers.interopRequireDefault(require('./Parent'));
var _Child2 = babelHelpers.interopRequireDefault(require('./Child'));
function MyComponent(_ref) {
  var _Child;
  var closeFn = _ref.closeFn;
  return /*#__PURE__*/ Reblend.construct(_Parent['default'], {
    render: function render() {
      return (
        _Child ||
        (_Child = /*#__PURE__*/ Reblend.construct(_Child2['default'], {
          closeFn: closeFn,
        }))
      );
    },
  });
}
var _default = (exports['default'] = _Parent['default']);
