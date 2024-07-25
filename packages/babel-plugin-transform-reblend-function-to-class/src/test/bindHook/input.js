import "./App.css";
import Reblend, {
  useContext,
  useContextDispatch,
  useMemo,
  useState,
} from "reblendjs";
//@ts-ignore
import logo from "./logo.svg";
import { ThemeContext } from "./context";

function App() {
  const [s, setS] = useState(1);

  setInterval(() => {
    setS((pre) => pre + 2);
  }, 1000);

  const msg = useMemo(() => `State = "${s}"`, [s]);

  const theme = useContext(ThemeContext);
  const themeDispatcher = useContextDispatch(ThemeContext);

  setTimeout(() => {
    themeDispatcher("yellow");
  }, 10000);

  return (
    <div className="App">
      <header className="App-header">
        <img
          class={"App"}
          src={logo}
          className="App-logo"
          alt="logo"
          style={{ width: "50px" }}
        />
        <p style={{ theme, color: theme, themeDispatcher, t: ThemeContext }}>
          Edit <code>src/App.tsx</code> and save to reload. {`{${msg}}`}
        </p>
        <a
          className="App-link"
          href="https://reblendjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Reblend
        </a>
      </header>
    </div>
  );
}

export default App;
