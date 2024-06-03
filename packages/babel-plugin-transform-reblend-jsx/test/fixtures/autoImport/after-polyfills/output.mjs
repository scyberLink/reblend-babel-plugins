// https://github.com/babel/babel/issues/12522

import 'reblend-app-polyfill/ie11';
import 'reblend-app-polyfill/stable';
import ReblendDOM from 'reblend-dom';
import { jsx as _jsx } from 'reblend/jsx-runtime';
ReblendDOM.render(
  /*#__PURE__*/ _jsx('p', {
    children: 'Hello, World!',
  }),
  document.getElementById('root')
);
