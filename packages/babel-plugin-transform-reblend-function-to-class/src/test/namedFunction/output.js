import Reblend, { useState, useEffect } from "reblendjs";
const SampleComponent = class SampleComponent extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  init() {
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
  html() {
    return /*#__PURE__*/Reblend.construct.bind(this)("div", null, /*#__PURE__*/Reblend.construct.bind(this)("p", null, "Count: ", this.count), /*#__PURE__*/Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"));
  }
} /* Transformed from function to class */;
export default SampleComponent;