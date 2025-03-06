import logo from "./logo.svg";
import "./App.css";
import Reblend, { useState } from "reblendjs";
const App = class
  /* Transformed from function to class */
extends Reblend {
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
  }
  async initProps(props) {
    this.props = {};
    this.props = props;
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
      className: "App-link",
      href: "https://reblendjs.org",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Learn Reblend"), Reblend.construct.bind(this)(this.props.App, null))));
  }
};
export default App;