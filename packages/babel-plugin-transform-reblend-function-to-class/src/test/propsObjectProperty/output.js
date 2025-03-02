/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { isCallable } from '../../common/utils';
import { BaseComponent, ReblendRenderingException } from '../../internal/BaseComponent';
import { Reblend } from '../../internal/Reblend';

//@ReblendComponent
class TryCatchError extends Reblend {
  static ELEMENT_NAME = "TryCatchError";
  constructor() {
    super();
  }
  async initState() {
    this.state.thisComponent.renderingErrorHandler = e => {
      this.state.thisComponent.renderingError = e;
      //if (!this.stateEffectRunning && this.attached) {
      //Promise.resolve().then(() => {
      this.state.thisComponent.onStateChange();
      //})
      //}
    };
    const view = () => {
      const arr = [];
      for (const child of this.props.children) {
        if (isCallable(child)) {
          arr.push(child(this.state.thisComponent.renderingError));
        } else {
          arr.push(child);
        }
      }
      this.state.thisComponent.renderingError = null;
      return arr;
    };
    this.state.view = view;
  }
  async initProps({
    children = _error => Reblend.construct.bind(this)(Reblend, null, '')
  }, thisComponent) {
    this.props = {};
    this.props.children = children;
    this.state.thisComponent = thisComponent;
  }
  async html() {
    return Reblend.construct.bind(this)("div", null, this.state.view());
  }
}
/* Transformed from function to class */
export { TryCatchError };