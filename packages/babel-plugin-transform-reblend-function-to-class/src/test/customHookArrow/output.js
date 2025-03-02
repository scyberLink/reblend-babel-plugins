import { useState, useMemo } from "reblendjs";
//@ReblendHook
export const useNameExportArrowFunctionHook = function useNameExportArrowFunctionHook(useNameExportArrowFunctionHookProps) {
  const [i, setI] = useState.bind(this)(initial, "i");
  this.state.i = i;
  this.state.setI = setI;
  const ii = useMemo.bind(this)(() => {
    return `i = ${this.state.i + 2}`;
  }, "[this.state.i]", "ii");
  this.state.ii = ii;
  return [this.state.setI, this.state.ii];
} /* Transformed from function to class */;