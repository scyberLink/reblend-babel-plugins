import './App.css';
import Reblend, { useContextDispatch, useMemo, useState } from 'reblendjs';
//@ts-ignore
import logo from './logo.svg';
import { ThemeContext } from './context';
import { rand } from 'reblendjs/dist/common/utils';
import Header from './Header';
import useI from './hook';

function App() {
  const [msg, s] = useI();

  const Header1 = useMemo(() => {

    return (
      <>
        <Header {...{ logo, msg, i: s }} />
      </>
    );
    
  }, []);
  const themeDispatcher = useContextDispatch(ThemeContext);

  const colors = ['azure', 'yellow', 'pink', 'purple', 'green', 'red'];
  setInterval(() => {
    themeDispatcher(colors[rand(0, colors.length)]);
  }, 2000);

  return (
    <>
      {/* @ts-ignore */}
      <Header1 />
      <div {...{ className: 'App' }}>
        <Header {...{ logo, msg, i: s }} />
      </div>
    </>
  );
}

export default App;
