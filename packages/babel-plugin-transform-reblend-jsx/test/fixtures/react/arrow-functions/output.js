var foo = function () {
  var _this = this;
  return function () {
    return /*#__PURE__*/Reblend.createElement(_this, null);
  };
};
var bar = function () {
  var _this2 = this;
  return function () {
    return /*#__PURE__*/Reblend.createElement(_this2.foo, null);
  };
};
