import React from 'react';
import useCounter from './useCounter';
const SampleComponent = function (props) {
  const {
    count,
    increment
  } = useCounter();
  return /*#__PURE__*/Reblend.construct.bind(this)("div", null, /*#__PURE__*/Reblend.construct.bind(this)("p", null, "Count: ", count), /*#__PURE__*/Reblend.construct.bind(this)("button", {
    onClick: increment
  }, "Increment"), /*#__PURE__*/Reblend.construct.bind(this)("p", null, "Hello, ", props.name, "!"));
};
export default SampleComponent;