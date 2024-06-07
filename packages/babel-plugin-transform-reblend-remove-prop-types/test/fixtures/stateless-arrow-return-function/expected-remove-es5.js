"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reblend = babelHelpers.interopRequireWildcard(require("reblend"));

var _map = babelHelpers.interopRequireDefault(require("lodash/map"));

var Message = function Message(_ref) {
  var mapList = _ref.mapList;
  return (0, _map.default)(mapList, function (index) {
    return _reblend.default.createElement("div", null);
  });
};

var _default = Message;
exports.default = _default;
