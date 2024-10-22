import Reblend from "reblendjs";
import useCounter from './useCounter';
const reassignmentMapping = class
  /* Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "reassignmentMapping";
  constructor() {
    super();
  }
  initState() {
    const {
      count,
      increment = 'indes'
    } = useCounter.bind(this)("");
    this.count = count;
    this.increment = increment;
    let reassignmentMapping_data = this.count;
    this.reassignmentMapping_data = reassignmentMapping_data;
    useEffect.bind(this)(() => {
      let reassignmentMapping_data;
      if (!reassignmentMapping_data) {
        /* Expects this.reassignmentMapping_data = {} */
        reassignmentMapping_data = {};
      } else {
        reassignmentMapping_data = false;
      }
    }, "[yes]");
    let f = false;
    this.f = f;
  }
  initProps(props) {
    this.props = {};
    this.props = props;
  }
  html() {
    return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)("p", null, "Count: ", (this.f = this.increment, this.count)), Reblend.construct.bind(this)("button", {
      onClick: (this.reassignmentMapping_data.prop1 = this, this.increment)
    }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"));
  }
};
export default reassignmentMapping;