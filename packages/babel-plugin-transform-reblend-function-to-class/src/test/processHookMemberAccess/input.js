import {Reblend as rbl } from 'reblendjs';

const SampleComponent = ({ name }) => {
  const [, setContext] = rbl.useContext(0);
  const [State, setState] = rbl.useState(0);
  const [Ref, setRef] = rbl.useRef(0);
  const [Reducer, setReducer] = rbl.useReducer(0);
  const [Callback, setCallback] = rbl.useCallback(0);
  const Memo = rbl.useMemo(() => {});
  rbl.useEffect(() => {});
};

export default SampleComponent;
