import { useState, useMemo } from "reblendjs";

//@ReblendHook
const useCustomHook = function useCustomHook(initial) {
  this.state.initial = initial;
  const [i, setI] = useState.bind(this)(this.state.initial, "i");
  this.state.i = i;
  this.state.setI = setI;
  const ii = useMemo.bind(this)(() => {
    return `i = ${this.state.i + 2}`;
  }, "ii", (() => [this.state.i]).bind(this));
  this.state.ii = ii;
  return [this.state.setI, this.state.ii];
} /* @Reblend: Transformed from function to class */;
export default useCustomHook;