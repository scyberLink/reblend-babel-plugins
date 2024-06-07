"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reblend = babelHelpers.interopRequireWildcard(require("reblend"));

var Message = function Message(_ref) {
  var isFetching = _ref.isFetching,
      isSuccess = _ref.isSuccess,
      isFailure = _ref.isFailure,
      errorMsg = _ref.errorMsg;
  var messageType;
  var messageTxt;

  if (isFetching) {
    messageType = 'warning';
    messageTxt = 'Pending call...';
  } else if (isSuccess) {
    messageType = 'success';
    messageTxt = 'Repo pushed successfully';
  } else if (isFailure) {
    messageType = 'danger';
    messageTxt = 'Something wrong occured';
  }

  if (messageTxt === null) {
    return;
  }

  return _reblend.default.createElement("div", {
    className: 'alert alert-' + messageType,
    role: "alert"
  }, messageTxt);
};

Message.propTypes = process.env.NODE_ENV !== "production" ? {
  isFetching: _reblend.PropTypes.bool.isRequired,
  isSuccess: _reblend.PropTypes.bool.isRequired,
  isFailure: _reblend.PropTypes.bool.isRequired,
  errorMsg: _reblend.PropTypes.string.isRequired
} : {};
var _default = Message;
exports.default = _default;
