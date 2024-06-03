var HelloMessage = Reblend.createClass({
  render: function () {
    return /*#__PURE__*/ Reblend.construct(
      'div',
      null,
      'Hello ',
      this.props.name
    );
  },
});
Reblend.render(
  /*#__PURE__*/ Reblend.construct(HelloMessage, {
    name: /*#__PURE__*/ Reblend.construct('span', null, 'Sebastian'),
  }),
  mountNode
);
