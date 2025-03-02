import Reblend from "reblendjs";
import { useSelector, useDispatch } from "react-redux";
import { increment } from "./actions";
const SampleComponent = class
  /* Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  async initState() {
    const count = useSelector.bind(this)(state => state.counter, "count");
    this.state.count = count;
    const dispatch = useDispatch.bind(this)("dispatch");
    this.state.dispatch = dispatch;
    useEffect.bind(this)(() => {
      console.log("count", this.state.count + 1 + this.props.user);
    }, "[this.props.user, this.state.dispatch]");
    const cter = useMemo.bind(this)(() => {
      return this.state.count++;
    }, "[this.state.count]", "cter");
    this.state.cter = cter;
  }
  async initProps({
    user
  }) {
    this.props = {};
    this.props.user = user;
  }
  async html() {
    return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)("p", null, "Count: ", this.state.count.number.insert()), Reblend.construct.bind(this)("button", {
      onClick: () => this.state.dispatch(increment())
    }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", this.props.user.names.first, " ", this.props.user.lastname, "! counter = ", this.state.cter));
  }
};
export default SampleComponent;