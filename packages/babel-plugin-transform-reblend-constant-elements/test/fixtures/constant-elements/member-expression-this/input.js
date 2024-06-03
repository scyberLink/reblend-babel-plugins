class Component extends Reblend.Component {
  subComponent = () => <span>Sub Component</span>

  render = () => <this.subComponent />
}
