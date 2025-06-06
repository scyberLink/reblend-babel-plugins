import Reblend from "reblendjs";
import useCounter from './useCounter';
const ReassignmentMapping = class
  /* @Reblend: Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "ReassignmentMapping";
  constructor() {
    super();
  }
  async initState() {
    const {
      count,
      increment = 'indes'
    } = useCounter.bind(this)();
    this.state.count = count;
    this.state.increment = increment;
    let reassignmentMapping_data = this.state.count;
    this.state.reassignmentMapping_data = reassignmentMapping_data;
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
    this.state.f = f;
  }
  async initProps(props) {
    this.props = {};
    this.props = props;
  }
  async html() {
    return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)("p", null, "Count: ", (this.state.f = this.state.increment, this.state.count)), Reblend.construct.bind(this)("button", {
      onClick: (this.state.reassignmentMapping_data.prop1 = this, this.state.increment)
    }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"));
  }
};
export default reassignmentMapping;