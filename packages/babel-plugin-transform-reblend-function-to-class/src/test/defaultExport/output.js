import Reblend, { useState } from 'reblendjs';
export default class SampleComponent extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  initState() {
    const [count, setCount] = useState.bind(this)(0, "count");
    this.count = count;
    this.setCount = setCount;
    const handleClick = () => {
      this.setCount(this.count + 1);
    };
    this.handleClick = handleClick;
  }
  initProps(props) {
    this.props = {};
    this.props = props;
  }
  html() {
    return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)("p", null, "Count: ", this.count), Reblend.construct.bind(this)("button", {
      onClick: this.handleClick
    }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"));
  }
}
/* Transformed from function to class */