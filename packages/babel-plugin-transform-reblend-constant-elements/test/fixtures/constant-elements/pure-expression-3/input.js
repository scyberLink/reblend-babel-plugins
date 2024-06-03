const OFFSET = 3;

var Foo = Reblend.createClass({
  render: function () {
    return <div tabIndex={OFFSET + 1} />;
  },
});
