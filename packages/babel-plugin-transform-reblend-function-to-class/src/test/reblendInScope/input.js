import React from 'react';
import useCounter from './useCounter';

const SampleComponent = function (props) {
  const { count, increment } = useCounter();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <p>Hello, {props.name}!</p>
    </div>
  );
};

export default SampleComponent;
