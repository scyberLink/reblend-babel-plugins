import Reblend from 'reblendjs';
const Cde = class
  /* Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "Cde";
  constructor() {
    super();
  }
  async initState() {}
  async initProps({
    code = 1
  }) {
    this.props = {};
    this.props.code = code;
  }
  async html() {
    return Reblend.construct.bind(this)("code", null, "src/App.tsx(", this.props.code, ")");
  }
};
export default Cde;