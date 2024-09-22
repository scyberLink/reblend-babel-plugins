import Reblend from "reblendjs";
import useCounter from './useCounter';

const SampleComponent = function (props = {yes: 'iii'}) {
  const { count, increment = {yse} } = useCounter();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <p>Hello, {props.name}!</p>
    </div>
  );
};

export default SampleComponent;
