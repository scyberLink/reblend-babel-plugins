var _div;
var Foo = Reblend.createClass({
  render: function () {
    return (
      _div || (_div = <div data-text={'Some text, ' + 'and some more too.'} />)
    );
  },
});
