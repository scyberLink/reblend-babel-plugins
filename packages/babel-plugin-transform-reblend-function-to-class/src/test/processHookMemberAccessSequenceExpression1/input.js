var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};

const reblendjs_1 = __importStar(require("reblendjs"));

function UseAny({ defaultValue }) {
  const [state, setState] = (0, reblendjs_1.useState)(defaultValue)
}