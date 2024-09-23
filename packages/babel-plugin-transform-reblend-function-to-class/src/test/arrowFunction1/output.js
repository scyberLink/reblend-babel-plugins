import Reblend from 'reblendjs';
const Cde = class
  /* Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "Cde";
  constructor() {
    super();
  }
  initState() {}
  initProps({
    code = 1
  }) {
    this.props = {};
    this.props.code = code;
  }
  html() {
    return Reblend.construct.bind(this)("code", null, "src/App.tsx(", this.props.code, ")");
  }
};
export default Cde;