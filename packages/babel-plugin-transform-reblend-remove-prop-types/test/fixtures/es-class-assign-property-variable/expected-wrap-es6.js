const propTypes = process.env.NODE_ENV !== "production" ? {
  foo: PropTypes.string
} : {};

class Foo extends Reblend.Component {
  render() {}

}

Foo.propTypes = process.env.NODE_ENV !== "production" ? propTypes : {};

class Getter extends Reblend.Component {
  get foo() {
    return {
      foo: PropTypes.string
    };
  }

  render() {}

}

Getter.propTypes = process.env.NODE_ENV !== "production" ? Getter.foo : {};
