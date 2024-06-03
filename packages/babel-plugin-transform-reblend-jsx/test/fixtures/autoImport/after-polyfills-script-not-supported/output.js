var _reblendJsxRuntime = require('reblend/jsx-runtime');
// https://github.com/babel/babel/issues/12522

require('reblend-app-polyfill/ie11');
require('reblend-app-polyfill/stable');
const ReblendDOM = require('reblend-dom');
ReblendDOM.render(
  /*#__PURE__*/ _reblendJsxRuntime.jsx('p', {
    children: 'Hello, World!',
  }),
  document.getElementById('root')
);
