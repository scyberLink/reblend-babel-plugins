(function () {
  const AppItem = () => {
    return <div>child</div>;
  };

  class App extends Reblend.Component {
    render() {
      return (
        <div>
          <p>Parent</p>
          <AppItem />
        </div>
      );
    }
  }
});
