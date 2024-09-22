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
  initState() {
    const [s, setS] = useState.bind(this)(1, "s");
    this.s = s;
    this.setS = setS;
    const msg = useMemo.bind(this)(() => `State = "${this.s}"`, "[this.s]", "msg");
    this.msg = msg;
    const theme = useContext.bind(this)(ThemeContext, "theme");
    this.theme = theme;
    const themeDispatcher = useContextDispatch.bind(this)(ThemeContext, "themeDispatcher");
    this.themeDispatcher = themeDispatcher;
  }
  initProps() {
    this.props = {};
  }
  html() {
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
        theme: this.theme,
        color: this.theme,
        themeDispatcher: this.themeDispatcher,
        t: ThemeContext
      }
    }, "Edit ", Reblend.construct.bind(this)("code", null, "src/App.tsx"), " and save to reload. ", `{${this.msg}}`), Reblend.construct.bind(this)("a", {
      className: "App-link",
      href: "https://reblendjs.org",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Learn Reblend")));
  }
}
/* Transformed from function to class */
export default App;