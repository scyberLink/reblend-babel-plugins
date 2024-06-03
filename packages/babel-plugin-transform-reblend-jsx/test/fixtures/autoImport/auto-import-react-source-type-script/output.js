var _reblend = require('reblend');
var _reblendJsxRuntime = require('reblend/jsx-runtime');
var x = /*#__PURE__*/ _reblendJsxRuntime.jsx(_reblendJsxRuntime.Fragment, {
  children: /*#__PURE__*/ _reblendJsxRuntime.jsxs('div', {
    children: [
      /*#__PURE__*/ _reblendJsxRuntime.jsx('div', {}, '1'),
      /*#__PURE__*/ _reblendJsxRuntime.jsx(
        'div',
        {
          meow: 'wolf',
        },
        '2'
      ),
      /*#__PURE__*/ _reblendJsxRuntime.jsx('div', {}, '3'),
      /*#__PURE__*/ _reblend.createElement('div', {
        ...props,
        key: '4',
      }),
    ],
  }),
});
