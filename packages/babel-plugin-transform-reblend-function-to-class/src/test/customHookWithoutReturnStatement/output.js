import { useState, useMemo } from "reblendjs";
//@ReblendHook
export default function useCustomHook(initial) {
  const [i, setI] = useState.bind(this)(initial, "i");
  this.state.i = i;
  this.state.setI = setI;
  const ii = useMemo.bind(this)(() => {
    return `i = ${this.state.i + 2}`;
  }, "[this.state.i]", "ii");
  this.state.ii = ii;
  return;
}
/* Transformed from function to class */