import "./App.css";
import Reblend, { useContext, useContextDispatch, useMemo, useState } from "reblendjs";
//@ts-ignore
import logo from "./logo.svg";
import { ThemeContext } from "./context";
class App extends Reblend {
  static ELEMENT_NAME = "App";
  constructor() {
    super();
  }
  async initState() {
    const [s, setS] = useState.bind(this)(1, "s");
    this.state.s = s;
    this.state.setS = setS;
    setInterval(() => {
      this.state.setS(pre => pre + 2);
    }, 1000);
    const msg = useMemo.bind(this)(() => `State = "${this.state.s}"`, "msg", (() => [this.state.s]).bind(this));
    this.state.msg = msg;
    const theme = useContext.bind(this)(ThemeContext, "theme");
    this.state.theme = theme;
    const themeDispatcher = useContextDispatch.bind(this)(ThemeContext);
    this.state.themeDispatcher = themeDispatcher;
    setTimeout(() => {
      this.state.themeDispatcher("yellow");
    }, 10000);
  }
  async initProps() {
    this.props = arguments[0] || {};
  }
  async html() {
    return Reblend.construct.bind(this)("div", {
      className: "App"
    }, Reblend.construct.bind(this)("header", {
      className: "App-header"
    }, Reblend.construct.bind(this)("img", {
      class: "App",
      src: logo,
      className: "App-logo",
      alt: "logo",
      style: {
        width: "50px"
      }
    }), Reblend.construct.bind(this)("p", {
      style: {
        theme: this.state.theme,
        color: this.state.theme,
        themeDispatcher: this.state.themeDispatcher,
        t: ThemeContext
      }
    }, "Edit ", Reblend.construct.bind(this)("code", null, "src/App.tsx"), " and save to reload. ", `{${this.state.msg}}`), Reblend.construct.bind(this)("a", {
      className: "App-link",
      href: "https://reblendjs.org",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Learn Reblend")));
  }
}
/* @Reblend: Transformed from function to class */
export default App;