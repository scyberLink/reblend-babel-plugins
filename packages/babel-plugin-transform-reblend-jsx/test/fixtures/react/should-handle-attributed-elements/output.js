var HelloMessage = Reblend.createClass({
  render: function () {
    return /*#__PURE__*/Reblend.createElement("div", null, "Hello ", this.props.name);
  }
});
Reblend.render( /*#__PURE__*/Reblend.createElement(HelloMessage, {
  name: /*#__PURE__*/Reblend.createElement("span", null, "Sebastian")
}), mountNode);
