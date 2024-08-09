import React from 'react';
import useCounter from './useCounter';
const SampleComponent = function (props) {
  const {
    count,
    increment
  } = useCounter();
  return Reblend.construct.bind(this)("div", null, Reblend.construct.bind(this)("p", null, "Count: ", count), Reblend.construct.bind(this)("button", {
    onClick: increment
  }, "Increment"), Reblend.construct.bind(this)("p", null, "Hello, ", props.name, "!"));
};
export default SampleComponent;