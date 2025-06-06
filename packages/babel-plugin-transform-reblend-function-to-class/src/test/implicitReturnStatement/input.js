import Reblend, { useState } from 'reblendjs';

//@ReblendComponent
export default function sampleComponent(props) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };
}
