import Reblend, { useState } from "reblendjs";
const SampleComponent = class
  /* Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  init() {
    const [count, setCount] = useState.bind(this)(0, "count");
    this.count = count;
    this.setCount = setCount;
    const Header1 = useMemo.bind(this)(() => {
      return /*#__PURE__*/Reblend.construct.bind(this)(Reblend, null, /*#__PURE__*/Reblend.construct.bind(this)(Header, {
        logo,
        msg,
        i: s
      }));
    }, "[]", "Header1");
    this.Header1 = Header1;
    const handleClick = () => {
      this.setCount(this.count + 1);
    };
    this.handleClick = handleClick.bind(this);
  }
  html() {
    return /*#__PURE__*/Reblend.construct.bind(this)("div", null, /*#__PURE__*/Reblend.construct.bind(this)(this.Header1, null), /*#__PURE__*/Reblend.construct.bind(this)("p", null, "Count: ", this.count), /*#__PURE__*/Reblend.construct.bind(this)("button", {
      onClick: this.handleClick
    }, "Increment"), /*#__PURE__*/Reblend.construct.bind(this)("p", null, "Hello, ", this.props.name, "!"), /*#__PURE__*/Reblend.construct.bind(this)(this.props.Header2, null));
  }
};
export default SampleComponent;