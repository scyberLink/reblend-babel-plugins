import Reblend from 'reblend';
export default function App() {
  return /*#__PURE__*/ Reblend.construct(
    'div',
    {
      className: 'App',
    },
    /*#__PURE__*/ Reblend.construct('h1', null, 'Welcome to my application!'),
    'This is my app!',
    /*#__PURE__*/ Reblend.construct('strong', null, 'MINE.')
  );
}
