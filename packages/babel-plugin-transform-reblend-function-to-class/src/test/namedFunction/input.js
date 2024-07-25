import Reblend, { useState, useEffect } from "reblendjs";

const SampleComponent = function SampleComponent(props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Hello, {props.name}!</p>
    </div>
  );
};

export default SampleComponent;
