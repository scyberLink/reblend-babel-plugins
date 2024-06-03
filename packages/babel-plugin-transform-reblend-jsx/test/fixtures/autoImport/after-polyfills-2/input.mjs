// https://github.com/babel/babel/issues/12522

ReblendDOM.render(
    <p>Hello, World!</p>,
    document.getElementById('root')
);

// Imports are hoisted, so this is still ok
import 'reblend-app-polyfill/ie11';
import 'reblend-app-polyfill/stable';
import ReblendDOM from 'reblend-dom';
