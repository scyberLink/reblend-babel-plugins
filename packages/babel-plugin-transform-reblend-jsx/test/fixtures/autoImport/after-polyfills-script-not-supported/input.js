// https://github.com/babel/babel/issues/12522

require('reblend-app-polyfill/ie11');
require('reblend-app-polyfill/stable');
const ReblendDOM = require('reblend-dom');

ReblendDOM.render(<p>Hello, World!</p>, document.getElementById('root'));
