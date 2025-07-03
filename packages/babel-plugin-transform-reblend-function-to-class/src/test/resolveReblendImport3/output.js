const R = require('reblendjs');
const Cde = class
  /* @Reblend: Transformed from function to class */
extends R.Reblend {
  static ELEMENT_NAME = "Cde";
  constructor() {
    super();
  }
  async initState() {}
  async initProps({
    code = 1
  }) {
    this.props = arguments[0] || {};
    this.props.code = code;
  }
  async html() {
    return R.Reblend.construct.bind(this)("code", null, "src/App.tsx(", this.props.code, ")");
  }
};
export default Cde;