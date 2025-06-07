function SampleComponent() {
  const [count, setCount] = useState(0);
  const memo = useMemo(() => console.log("memo"), count)
  const memoArray = useMemo(() => console.log("memo"), [count])
  useEffect(() => console.log("effect"), count)
  useEffect(() => console.log("effect"), [count])
  useEffectAfter(() => console.log("effect"), count)
  useEffectAfter(() => console.log("effect"), [count])
}

export default SampleComponent;