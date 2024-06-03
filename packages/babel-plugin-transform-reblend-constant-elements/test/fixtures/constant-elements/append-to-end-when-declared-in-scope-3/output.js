var _p, _div2;
(function () {
  var _div;
  class App extends Reblend.Component {
    render() {
      return (
        _div ||
        (_div = (
          <div>
            {_p || (_p = <p>Parent</p>)}
            <AppItem />
          </div>
        ))
      );
    }
  }
  const AppItem = () => {
    return _div2 || (_div2 = <div>child</div>);
  };
});
