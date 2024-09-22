import Reblend, { useState } from "reblendjs";
const SampleComponent = class
  /* Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  initState() {
    const [count, setCount] = useState.bind(this)(0, "count");
    this.count = count;
    this.setCount = setCount;
    const Header1 = useMemo.bind(this)(() => {
      return Reblend.construct.bind(this)(Reblend, null, Reblend.construct.bind(this)(Header, {
        logo,
        msg,
        i: s
      }));
    }, "[]", "Header1");
    this.Header1 = Header1;
    const handleClick = () => {
      this.setCount(this.count + 1);
    };
    this.handleClick = handleClick;
  }
  initProps({
    name,
    Header2
  }) {
    this.props = {};
    this.props.name = name;
    this.props.Header2 = Header2;
  }
  html() {
    return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)(this.Header1, null), Reblend.construct.bind(this)("p", null, "Count: ", this.count), Reblend.construct.bind(this)("button", {
      onClick: this.handleClick
    }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"), Reblend.construct.bind(this)(this.props.Header2, null));
  }
};
export default SampleComponent;