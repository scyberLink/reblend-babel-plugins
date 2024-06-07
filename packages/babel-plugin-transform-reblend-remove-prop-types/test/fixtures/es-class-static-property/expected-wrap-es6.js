class Foo1 extends Reblend.Component {
  render() {}

}

Foo1.propTypes = process.env.NODE_ENV !== "production" ? {
  bar1: PropTypes.string
} : {};
export default class Foo2 extends Reblend.Component {
  render() {}

}
Foo2.propTypes = process.env.NODE_ENV !== "production" ? {
  bar2: PropTypes.string
} : {};
