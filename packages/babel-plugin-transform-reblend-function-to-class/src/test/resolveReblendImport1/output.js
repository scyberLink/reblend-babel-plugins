const reblendjs_1 = __importStar(require("reblendjs"));
const Cde = class
  /* @Reblend: Transformed from function to class */
extends reblendjs_1.Reblend {
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
    return reblendjs_1.Reblend.construct.bind(this)("code", null, "src/App.tsx(", this.props.code, ")");
  }
};
export default Cde;