import { Reblend as rbl } from 'reblendjs';
const SampleComponent = class
  /* @Reblend: Transformed from function to class */
extends rbl {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  async initState() {
    const [, setContext] = rbl.useContext.bind(this)(0, "unneededIdentifier_53e8b51e-74e3-436e-8bab-2ed0334f076a");
    this.state.setContext = setContext;
    const [State, setState] = rbl.useState.bind(this)(0, "State");
    this.state.State = State;
    this.state.setState = setState;
    const [Ref, setRef] = rbl.useRef.bind(this)(0);
    this.state.Ref = Ref;
    this.state.setRef = setRef;
    const [Reducer, setReducer] = rbl.useReducer.bind(this)(0, "Reducer");
    this.state.Reducer = Reducer;
    this.state.setReducer = setReducer;
    const [Callback, setCallback] = rbl.useCallback.bind(this)(0);
    this.state.Callback = Callback;
    this.state.setCallback = setCallback;
    const Memo = rbl.useMemo.bind(this)(() => {}, "Memo");
    this.state.Memo = Memo;
    rbl.useEffect.bind(this)(() => {});
  }
  async initProps({
    name
  }) {
    this.props = {};
    this.props.name = name;
  }
  async html() {
    return;
  }
};
export default SampleComponent;