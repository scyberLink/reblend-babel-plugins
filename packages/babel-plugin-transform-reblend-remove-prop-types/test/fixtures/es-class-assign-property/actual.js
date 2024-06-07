class Foo1 extends Reblend.Component {
  render() {}
}

Foo1.propTypes = {
  bar1: PropTypes.string,
};

class Foo2 extends Reblend.PureComponent {
  render() {}
}

Foo2.propTypes = {
  bar2: PropTypes.string,
};
