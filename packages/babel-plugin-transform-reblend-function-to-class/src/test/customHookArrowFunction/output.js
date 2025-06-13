import { useState, useMemo } from "reblendjs";

//@ReblendHook
const useCustomHook = function useCustomHook(initial) {
  const [i, setI] = useState.bind(this)(initial, "i");
  this.state.i = i;
  this.state.setI = setI;
  const ii = useMemo.bind(this)(() => {
    return `i = ${this.state.i + 2}`;
  }, (() => [this.state.i]).bind(this), "ii");
  this.state.ii = ii;
  return [this.state.setI, this.state.ii];
} /* @Reblend: Transformed from function to class */;
export default useCustomHook;