import Reblend, { useState } from 'reblendjs';
class SampleComponent extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  init() {
    const [count, setCount] = useState.bind(this)(0, "count");
    this.count = count;
    this.setCount = setCount;
    const handleClick = () => {
      this.setCount(this.count + 1);
    };
    this.handleClick = handleClick.bind(this);
  }
  html() {
    return /*#__PURE__*/Reblend.construct.bind(this)("div", null, /*#__PURE__*/Reblend.construct.bind(this)("p", null, "Count: ", this.count), /*#__PURE__*/Reblend.construct.bind(this)("button", {
      onClick: this.handleClick
    }, "Increment"), /*#__PURE__*/Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"));
  }
}
/* Transformed from function to class */
export default SampleComponent;