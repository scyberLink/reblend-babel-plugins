import logo from "./logo.svg";
import "./App.css";
import Reblend, { useState } from "reblendjs";
class App extends Reblend {
  static ELEMENT_NAME = "App";
  constructor() {
    super();
  }
  async initState() {
    const [state, setState] = useState.bind(this)(0, "state");
    this.state.state = state;
    this.state.setState = setState;
    setInterval(() => {
      this.state.setState(this.state.state + 1);
    }, 1000);
    const ts = () => {
      console.log(this);
    };
    this.state.ts = ts;
    const ats = async () => {
      console.log(this);
    };
    this.state.ats = ats;
    const tss = () => console.log(this);
    this.state.tss = tss;
    const atss = async () => console.log(this);
    this.state.atss = atss;
  }
  async initProps() {
    this.props = {};
  }
  async html() {
    return Reblend.construct.bind(this)(Reblend, null, Reblend.construct.bind(this)("div", {
      className: "App"
    }, Reblend.construct.bind(this)("header", {
      className: "App-header"
    }, Reblend.construct.bind(this)("img", {
      src: logo,
      className: "App-logo",
      alt: "logo"
    }), Reblend.construct.bind(this)("p", null, "Edit ", Reblend.construct.bind(this)("code", null, "src/App.js"), " and save to reload. ", this.state.state), Reblend.construct.bind(this)("a", {
      onClick: r ? this.state.atss : t ? this.state.ats : this.state.ts,
      className: "App-link",
      href: "https://reblendjs.org",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Learn Reblend"))));
  }
}
/* Transformed from function to class */
export default App;