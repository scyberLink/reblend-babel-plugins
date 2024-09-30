import { useState, useMemo } from "reblendjs";
//@ReblendHook
export const useNameExportArrowFunctionHook = function useNameExportArrowFunctionHook(useNameExportArrowFunctionHookProps) {
  const [i, setI] = useState.bind(this)(initial, "i");
  this.i = i;
  this.setI = setI;
  const ii = useMemo.bind(this)(() => {
    return `i = ${this.i + 2}`;
  }, "[this.i]", "ii");
  this.ii = ii;
  return [this.setI, this.ii];
} /* Transformed from function to class */;