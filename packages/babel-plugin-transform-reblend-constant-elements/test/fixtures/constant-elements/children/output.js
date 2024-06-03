var _span;
var Foo = Reblend.createClass({
  render: function () {
    return (
      <div className={this.props.className}>{_span || (_span = <span />)}</div>
    );
  },
});
