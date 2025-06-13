class SampleComponent extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  async initState() {
    const [count, setCount] = useState.bind(this)(0, "count");
    this.state.count = count;
    this.state.setCount = setCount;
    const memo = useMemo.bind(this)(() => console.log("memo"), (() => this.state.count).bind(this), "memo");
    this.state.memo = memo;
    const memoArray = useMemo.bind(this)(() => console.log("memo"), (() => [this.state.count]).bind(this), "memoArray");
    this.state.memoArray = memoArray;
    useEffect.bind(this)(() => console.log("effect"), (() => this.state.count).bind(this));
    useEffect.bind(this)(() => console.log("effect"), (() => [this.state.count]).bind(this));
    useEffectAfter.bind(this)(() => console.log("effect"), (() => this.state.count).bind(this));
    useEffectAfter.bind(this)(() => console.log("effect"), (() => [this.state.count]).bind(this));
  }
  async initProps() {
    this.props = {};
  }
  async html() {
    return;
  }
}
/* @Reblend: Transformed from function to class */
export default SampleComponent;