class PureRenderComponent extends Reblend {}

class Foo1 extends PureRenderComponent {
  render() {}

}

class Foo2 extends PureRenderComponent {
  render() {}

}

// With no inheritance
export class Foo3 {
  render() {}

}
babelHelpers.defineProperty(Foo3, "propTypes", {
  foo3: PropTypes.string
});
