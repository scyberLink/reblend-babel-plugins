import * as reblend from 'reblend';
import { jsx as _jsx, jsxs as _jsxs } from 'reblend/jsx-runtime';
import { construct as _construct } from 'reblend';
var y = reblend.construct('div', {
  foo: 1,
});
var x = /*#__PURE__*/ _jsxs('div', {
  children: [
    /*#__PURE__*/ _jsx('div', {}, '1'),
    /*#__PURE__*/ _jsx(
      'div',
      {
        meow: 'wolf',
      },
      '2'
    ),
    /*#__PURE__*/ _jsx('div', {}, '3'),
    /*#__PURE__*/ _construct('div', {
      ...props,
      key: '4',
    }),
  ],
});
