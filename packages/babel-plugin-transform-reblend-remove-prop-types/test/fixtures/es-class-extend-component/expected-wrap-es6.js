class Foo1 extends Reblend {
  render() {}

}

Foo1.propTypes = process.env.NODE_ENV !== "production" ? {
  foo1: PropTypes.string
} : {};

class Foo2 extends Reblend {
  render() {}

}

Foo2.propTypes = process.env.NODE_ENV !== "production" ? {
  foo2: PropTypes.string
} : {};
