import Reblend from "reblendjs";
import useCounter from './useCounter';
const SampleComponent = class
  /* Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  init() {
    const {
      count,
      increment
    } = useCounter.bind(this)("");
    this.count = count;
    this.increment = increment;
  }
  html() {
    return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)("p", null, "Count: ", this.count), Reblend.construct.bind(this)("button", {
      onClick: this.increment
    }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"));
  }
};
export default SampleComponent;