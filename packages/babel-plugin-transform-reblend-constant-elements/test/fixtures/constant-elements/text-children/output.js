var _div;
var Foo = Reblend.createClass({
  render: function () {
    return _div || (_div = <div className="class-name">Text</div>);
  },
});
