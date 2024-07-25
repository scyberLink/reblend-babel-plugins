import { useState, useMemo } from "reblendjs";

//@ReblendHook
function useCustomHook(initial) {
  const [i, setI] = useState(initial);

  const ii = useMemo(() => {
    return `i = ${i + 2}`;
  }, [i]);

  return [setI, ii];
}

export default useCustomHook;
