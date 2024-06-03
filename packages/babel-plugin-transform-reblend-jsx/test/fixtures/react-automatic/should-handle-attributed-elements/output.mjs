import { jsxs as _jsxs, jsx as _jsx } from 'reblend/jsx-runtime';
var HelloMessage = Reblend.createClass({
  displayName: 'HelloMessage',
  render: function () {
    return /*#__PURE__*/ _jsxs('div', {
      children: ['Hello ', this.props.name],
    });
  },
});
Reblend.render(
  /*#__PURE__*/ _jsx(HelloMessage, {
    name: /*#__PURE__*/ _jsx('span', {
      children: 'Sebastian',
    }),
  }),
  mountNode
);
