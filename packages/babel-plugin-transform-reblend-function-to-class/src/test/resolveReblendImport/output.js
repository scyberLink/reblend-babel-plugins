import { Reblend as R } from 'reblendjs';
const Cde = class
  /* @Reblend: Transformed from function to class */
extends R {
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
    return R.construct.bind(this)("code", null, "src/App.tsx(", this.props.code, ")");
  }
};
export default Cde;