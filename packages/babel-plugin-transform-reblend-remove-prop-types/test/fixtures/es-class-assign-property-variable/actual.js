const propTypes = {
  foo: PropTypes.string
};

class Foo extends Reblend.Component {
  render() {}
}

Foo.propTypes = propTypes;

class Getter extends Reblend.Component {
  get foo() {
    return { foo: PropTypes.string };
  }

  render() {}
}

Getter.propTypes = Getter.foo;
