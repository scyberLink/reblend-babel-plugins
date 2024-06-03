var _reblendJsxRuntime = require("reblend/jsx-runtime");
const Bar = () => {
  const Foo = () => {
    const Component = ({
      thing,
      ..._reblend
    }) => {
      if (!thing) {
        var _reblend2 = "something useless";
        var b = _reblend3();
        var c = _reblend5();
        var jsx = 1;
        var _jsx = 2;
        return /*#__PURE__*/_reblendJsxRuntime.jsx("div", {});
      }
      ;
      return /*#__PURE__*/_reblendJsxRuntime.jsx("span", {});
    };
  };
};
