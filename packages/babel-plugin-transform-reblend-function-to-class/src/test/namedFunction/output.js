import Reblend, { useState, useEffect } from "reblendjs";
const SampleComponent = class SampleComponent extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  initState() {
    const [count, setCount] = useState.bind(this)(0, "count");
    this.count = count;
    this.setCount = setCount;
    useEffect.bind(this)(() => {
      const interval = setInterval(() => {
        this.setCount(prevCount => prevCount + 1);
      }, 1000);
      return () => clearInterval(interval);
    }, "[]");
  }
  initProps(props) {
    this.props = {};
    this.props = props;
  }
  html() {
    return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)("p", null, "Count: ", this.count), Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"));
  }
} /* Transformed from function to class */;
export default SampleComponent;