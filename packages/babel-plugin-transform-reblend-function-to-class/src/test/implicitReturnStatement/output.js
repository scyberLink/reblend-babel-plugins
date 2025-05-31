import Reblend, { useState } from 'reblendjs';

//@ReblendComponent
export default class SampleComponent extends Reblend {
  static ELEMENT_NAME = "SampleComponent";
  constructor() {
    super();
  }
  async initState() {
    const [count, setCount] = useState.bind(this)(0, "count");
    this.state.count = count;
    this.state.setCount = setCount;
    const handleClick = () => {
      this.state.setCount(this.state.count + 1);
    };
    this.state.handleClick = handleClick;
  }
  async initProps(props) {
    this.props = {};
    this.props = props;
  }
  async html() {
    return;
  }
}
/* Transformed from function to class */