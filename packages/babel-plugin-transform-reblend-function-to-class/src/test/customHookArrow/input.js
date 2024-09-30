import { useState, useMemo } from "reblendjs";
//@ReblendHook
export const useNameExportArrowFunctionHook = (useNameExportArrowFunctionHookProps) => {
  const [i, setI] = useState(initial);

  const ii = useMemo(() => {
    return `i = ${i + 2}`;
  }, [i]);

  return [setI, ii];
}
