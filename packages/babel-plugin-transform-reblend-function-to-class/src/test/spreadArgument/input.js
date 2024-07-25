import Reblend from "reblendjs";
import { useSelector, useDispatch } from "react-redux";
import { increment } from "./actions";

const SampleComponent = ({ user }) => {
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("count", count + 1 + user);
  }, [user, dispatch]);

  const cter = useMemo(() => {
    return count++;
  }, [count]);

  return (
    <div>
      <p>Count: {count.number.insert()}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <p>
        Hello, {user.names.first} {user.lastname}! counter = {cter}
      </p>
    </div>
  );
};

export default SampleComponent;
