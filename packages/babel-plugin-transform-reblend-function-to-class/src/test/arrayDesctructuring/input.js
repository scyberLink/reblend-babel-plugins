import Reblend, { useState } from "reblendjs";

const SampleComponent = ({ name, Header2 }) => {
  const [count, setCount] = useState(0);
  
  const Header1 = useMemo(() => {
    return (
      <>
        <Header {...{ logo, msg, i: s }} />
      </>
    );
  }, []);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <Header1 />
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <p>Hello, {name}!</p>
      <Header2 />
    </div>
  );
};

export default SampleComponent;
