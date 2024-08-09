import logo from "./logo.svg";
import "./App.css";
import Reblend, { useState } from "reblendjs";
class App extends Reblend {
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
    function ts() {
      console.log(this);
    }
    this.ts = ts.bind(this);
    async function ats() {
      console.log(this);
    }
    this.ats = ats.bind(this);
    const tss = () => console.log(this);
    this.tss = tss.bind(this);
    const atss = async () => console.log(this);
    this.atss = atss.bind(this);
  }
  html() {
    return Reblend.construct.bind(this)(Reblend, null, Reblend.construct.bind(this)("div", {
      className: "App"
    }, Reblend.construct.bind(this)("header", {
      className: "App-header"
    }, Reblend.construct.bind(this)("img", {
      src: logo,
      className: "App-logo",
      alt: "logo"
    }), Reblend.construct.bind(this)("p", null, "Edit ", Reblend.construct.bind(this)("code", null, "src/App.js"), " and save to reload. ", this.state), Reblend.construct.bind(this)("a", {
      onClick: this.atss,
      className: "App-link",
      href: "https://reblendjs.org",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Learn Reblend"))));
  }
}
/* Transformed from function to class */
export default App;