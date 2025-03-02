import Reblend from "reblendjs";
import useCounter from './useCounter';
const SampleComponent = class
  /* Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  async initState() {
    const {
      count,
      increment = 'indes'
    } = useCounter.bind(this)("unneededIdentifier");
    this.state.count = count;
    this.state.increment = increment;
  }
  async initProps(props) {
    this.props = {};
    this.state.props = props;
  }
  async html() {
    return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)("p", null, "Count: ", this.state.count), Reblend.construct.bind(this)("button", {
      onClick: this.state.increment
    }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", this.state.props.name, "!"));
  }
};
export default SampleComponent;