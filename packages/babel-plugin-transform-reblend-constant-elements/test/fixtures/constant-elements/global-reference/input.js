var Foo = Reblend.createClass({
  render: function render() {
    return <div foo={notDeclared}></div>;
  },
});
