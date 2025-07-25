import Reblend, { useState } from 'reblendjs';
class SampleComponent extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  async initState() {
    const [count, setCount] = useState.bind(this)(0, "count");
    this.state.count = count;
    this.state.setCount = setCount;
    const handleClick = () => {
      this.state.setCount(this.state.count + 1);
    };
    this.state.handleClick = handleClick;
  }
  async initProps({
    as: Component,
    name
  }) {
    this.props = arguments[0] || {};
    this.props.Component = Component;
    this.props.name = name;
  }
  async html() {
    return Reblend.construct.bind(this)(this.props.Component, null, Reblend.construct.bind(this)("p", null, "Count: ", this.state.count), Reblend.construct.bind(this)("button", {
      onClick: this.state.handleClick
    }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"));
  }
}
/* @Reblend: Transformed from function to class */
export default SampleComponent;