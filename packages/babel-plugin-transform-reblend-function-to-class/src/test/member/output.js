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
  async initState() {
    const [msg, s] = useI.bind(this)();
    this.state.msg = msg;
    this.state.s = s;
    const Header1 = useMemo.bind(this)(() => {
      return Reblend.construct.bind(this)(Reblend, null, Reblend.construct.bind(this)(Header, {
        logo,
        msg: this.state.msg,
        i: this.state.s
      }));
    }, "Header1", (() => []).bind(this));
    this.state.Header1 = Header1;
    const themeDispatcher = useContextDispatch.bind(this)(ThemeContext);
    this.state.themeDispatcher = themeDispatcher;
    const colors = ['azure', 'yellow', 'pink', 'purple', 'green', 'red'];
    this.state.colors = colors;
    setInterval(() => {
      this.state.themeDispatcher(this.state.colors[rand(0, this.state.colors.length)]);
    }, 2000);
  }
  async initProps() {
    this.props = {};
  }
  async html() {
    return Reblend.construct.bind(this)(Reblend, null, Reblend.construct.bind(this)(this.state.Header1, null), Reblend.construct.bind(this)("div", {
      className: 'App'
    }, Reblend.construct.bind(this)(Header, {
      logo,
      msg: this.state.msg,
      i: this.state.s
    })));
  }
}
/* @Reblend: Transformed from function to class */
export default App;