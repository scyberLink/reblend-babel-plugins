import Reblend, { useState } from 'reblendjs';

function SampleComponent({as: Component, name}) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <Component>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <p>Hello, {name}!</p>
    </Component>
  );
}

export default SampleComponent;
