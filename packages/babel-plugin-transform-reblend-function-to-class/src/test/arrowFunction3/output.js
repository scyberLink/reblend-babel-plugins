const HelloWorld = class
  /* @Reblend: Transformed from function to class */
extends Reblend {
  static ELEMENT_NAME = "HelloWorld";
  constructor() {
    super();
  }
  async initState() {}
  async initProps() {
    this.props = {};
  }
  async html() {
    return alert("HELLO from inside sequence expression"), 0, Reblend.construct.bind(this)(Reblend, null, Reblend.construct.bind(this)("h1", {
      "data-testid": "testId"
    }, "Hello World"), Reblend.construct.bind(this)("h1", {
      "data-testid": "testId"
    }, "Hello World"));
  }
};