import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from 'reblend/jsx-runtime';
import { construct as _construct } from 'reblend';
var x = /*#__PURE__*/ _jsx(_Fragment, {
  children: /*#__PURE__*/ _jsxs('div', {
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
  }),
});
