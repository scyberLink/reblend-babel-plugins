import { useState, useMemo } from "reblendjs";
//@ReblendHook
export default function useCustomHook(initial) {
  const [i, setI] = useState(initial);

  const ii = useMemo(() => {
    return `i = ${i + 2}`;
  }, [i]);
}
