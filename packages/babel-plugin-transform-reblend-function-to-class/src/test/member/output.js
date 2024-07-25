import './App.css';
import Reblend, { useContextDispatch, useMemo, useState } from 'reblendjs';
//@ts-ignore
import logo from './logo.svg';
import { ThemeContext } from './context';
import { rand } from 'reblendjs/dist/common/utils';
import Header from './Header';
import useI from './hook';
class App extends Reblend {
  static ELEMENT_NAME = "App";
  constructor() {
    super();
  }
  init() {
    const [msg, s] = useI.bind(this)("msg");
    this.msg = msg;
    this.s = s;
    const Header1 = useMemo.bind(this)(() => {
      return /*#__PURE__*/Reblend.construct.bind(this)(Reblend, null, /*#__PURE__*/Reblend.construct.bind(this)(Header, {
        logo,
        msg: this.msg,
        i: this.s
      }));
    }, "[]", "Header1");
    this.Header1 = Header1;
    const themeDispatcher = useContextDispatch.bind(this)(ThemeContext, "themeDispatcher");
    this.themeDispatcher = themeDispatcher;
    const colors = ['azure', 'yellow', 'pink', 'purple', 'green', 'red'];
    this.colors = colors;
    setInterval(() => {
      this.themeDispatcher(this.colors[rand(0, this.colors.length)]);
    }, 2000);
  }
  html() {
    return /*#__PURE__*/Reblend.construct.bind(this)(Reblend, null, /*#__PURE__*/Reblend.construct.bind(this)(this.Header1, null), /*#__PURE__*/Reblend.construct.bind(this)("div", {
      className: 'App'
    }, /*#__PURE__*/Reblend.construct.bind(this)(Header, {
      logo,
      msg: this.msg,
      i: this.s
    })));
  }
}
/* Transformed from function to class */
export default App;