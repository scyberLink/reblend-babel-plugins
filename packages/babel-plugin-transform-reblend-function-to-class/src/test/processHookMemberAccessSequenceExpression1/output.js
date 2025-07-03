var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
const reblendjs_1 = __importStar(require("reblendjs"));
class UseAny extends reblendjs_1.Reblend {
  static ELEMENT_NAME = "UseAny";
  constructor() {
    super();
  }
  async initState() {
    const [state, setState] = (0, reblendjs_1.useState.bind(this))(this.props.defaultValue, "state");
    this.state.state = state;
    this.state.setState = setState;
  }
  async initProps({
    defaultValue
  }) {
    this.props = arguments[0] || {};
    this.props.defaultValue = defaultValue;
  }
  async html() {
    return;
  }
}
/* @Reblend: Transformed from function to class */