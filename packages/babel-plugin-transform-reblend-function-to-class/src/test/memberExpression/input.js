import Reblend, { useState } from 'reblendjs';

const SampleComponent = ({ name }) => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <p>Hello, {name}!</p>
    </div>
  );
};

export default SampleComponent;
