import Reblend, { useState } from "reblendjs";
const SampleComponent = class
  /* @Reblend: Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  async initState() {
    const [count, setCount] = useState.bind(this)(0, "count");
    this.state.count = count;
    this.state.setCount = setCount;
    const Header1 = useMemo.bind(this)(() => {
      return Reblend.construct.bind(this)(Reblend, null, Reblend.construct.bind(this)(Header, {
        logo,
        msg,
        i: s
      }));
    }, "Header1", (() => []).bind(this));
    this.state.Header1 = Header1;
    const handleClick = () => {
      this.state.setCount(this.state.count + 1);
    };
    this.state.handleClick = handleClick;
  }
  async initProps({
    name,
    Header2
  }) {
    this.props = {};
    this.props.name = name;
    this.props.Header2 = Header2;
  }
  async html() {
    return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)(this.state.Header1, null), Reblend.construct.bind(this)("p", null, "Count: ", this.state.count), Reblend.construct.bind(this)("button", {
      onClick: this.state.handleClick
    }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"), Reblend.construct.bind(this)(this.props.Header2, null));
  }
};
export default SampleComponent;