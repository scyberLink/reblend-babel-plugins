class Foo extends Reblend.Component {
  render() {}

}

class Getter extends Reblend.Component {
  get foo() {
    return {
      foo: PropTypes.string
    };
  }

  render() {}

}
