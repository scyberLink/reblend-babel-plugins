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
  init() {
    const [state, setState] = useState.bind(this)(0, "state");
    this.state = state;
    this.setState = setState;
    setInterval(() => {
      this.setState(this.state + 1);
    }, 1000);
  }
  html() {
    return /*#__PURE__*/Reblend.construct.bind(this)(Reblend, null, /*#__PURE__*/Reblend.construct.bind(this)("div", {
      className: "App"
    }, /*#__PURE__*/Reblend.construct.bind(this)("header", {
      className: "App-header"
    }, /*#__PURE__*/Reblend.construct.bind(this)("img", {
      src: logo,
      className: "App-logo",
      alt: "logo"
    }), /*#__PURE__*/Reblend.construct.bind(this)("p", null, "Edit ", /*#__PURE__*/Reblend.construct.bind(this)("code", null, "src/App.js"), " and save to reload. ", this.state), /*#__PURE__*/Reblend.construct.bind(this)("a", {
      className: "App-link",
      href: "https://reblendjs.org",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Learn Reblend"), /*#__PURE__*/Reblend.construct.bind(this)(this.props.App, null))));
  }
};
export default App;