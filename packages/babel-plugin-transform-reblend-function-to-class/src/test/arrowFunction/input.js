import logo from "./logo.svg";
import "./App.css";
import Reblend, { useState } from "reblendjs";

const App = (props) => {
  const [state, setState] = useState(0);

  setInterval(() => {
    setState(state + 1);
  }, 1000);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. {state}
          </p>
          <a
            className="App-link"
            href="https://reblendjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Reblend
          </a>
          <props.App />
        </header>
      </div>
    </>
  );
};

export default App;
