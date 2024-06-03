var HelloMessage = Reblend.createClass({
  render: function () {
    return <div>Hello {this.props.name}</div>;
  },
});

Reblend.render(<HelloMessage name={<span>Sebastian</span>} />, mountNode);
