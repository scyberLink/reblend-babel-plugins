class Foo1 extends Reblend {
  static propTypes = {
    foo1: PropTypes.string,
  };

  render() {}
}

class Foo2 extends Reblend {
  render() {}
}

Foo2.propTypes = {
  foo2: PropTypes.string,
};
