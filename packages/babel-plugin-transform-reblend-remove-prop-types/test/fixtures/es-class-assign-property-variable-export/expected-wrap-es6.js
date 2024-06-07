export const propTypes = {
  foo: PropTypes.string
};

class Foo extends Reblend.Component {
  render() {}

}

Foo.propTypes = process.env.NODE_ENV !== "production" ? propTypes : {};
