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
  init() {
    const count = useSelector.bind(this)(state => state.counter, "count");
    this.count = count;
    const dispatch = useDispatch.bind(this)("dispatch");
    this.dispatch = dispatch;
    useEffect.bind(this)(() => {
      console.log("count", this.count + 1 + this.props.user);
    }, "[this.props.user, this.dispatch]");
    const cter = useMemo.bind(this)(() => {
      return this.count++;
    }, "[this.count]", "cter");
    this.cter = cter;
  }
  html() {
    return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)("p", null, "Count: ", this.count.number.insert()), Reblend.construct.bind(this)("button", {
      onClick: () => this.dispatch(increment())
    }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", this.props.user.names.first, " ", this.props.user.lastname, "! counter = ", this.cter));
  }
};
export default SampleComponent;