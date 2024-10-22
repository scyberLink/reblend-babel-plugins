import Reblend from "reblendjs";
import useCounter from './useCounter';

const reassignmentMapping = function (props) {
  const { count, increment = 'indes' } = useCounter();
  let reassignmentMapping_data = count

  useEffect(()=>{
    let reassignmentMapping_data
    if (!reassignmentMapping_data) {
      /* Expects this.reassignmentMapping_data = {} */
      reassignmentMapping_data = {}
    } else {
      reassignmentMapping_data  = false
    }
  },[yes])

  let f = false
  
  return (
    <div>
      <p>Count: {(f = increment, count)}</p>
      <button onClick={(reassignmentMapping_data.prop1 = this, increment)}>Increment</button>
      <p>Hello, {props.name}!</p>
    </div>
  );
};

export default reassignmentMapping;
