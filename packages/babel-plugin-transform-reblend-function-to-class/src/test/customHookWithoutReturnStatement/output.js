import { useState, useMemo } from "reblendjs";
//@ReblendHook
export default function useCustomHook(initial) {
  this.state.initial = initial;
  const [i, setI] = useState.bind(this)(this.state.initial, "i");
  this.state.i = i;
  this.state.setI = setI;
  const ii = useMemo.bind(this)(() => {
    return `i = ${this.state.i + 2}`;
  }, "ii", (() => [this.state.i]).bind(this));
  this.state.ii = ii;
  return;
}
/* @Reblend: Transformed from function to class */