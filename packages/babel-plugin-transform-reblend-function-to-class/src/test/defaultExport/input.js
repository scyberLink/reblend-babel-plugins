import Reblend, { useState } from 'reblendjs';

export default function SampleComponent(props) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <p>Hello, {props.name}!</p>
    </div>
  );
}
