import logo from "./logo.svg";
import "./App.css";
import Reblend, { useState } from "reblendjs";

function App() {
  const [state, setState] = useState(0);

  setInterval(() => {
    setState(state + 1);
  }, 1000);

  function ts() {
    console.log("this");
  }

  async function ats() {
    console.log("this");
  }

  const tss = () => console.log("this");
  const atss = async () => console.log("this");

  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. {state}
          </p>
          <a
            onClick={atss}
            className="App-link"
            href="https://reblendjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Reblend
          </a>
        </header>
      </div>
    </>
  );
}

export default App;
