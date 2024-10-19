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
  initState() {
    this.thisComponent.renderingErrorHandler = e => {
      this.thisComponent.renderingError = e;
      //if (!this.stateEffectRunning && this.attached) {
      //Promise.resolve().then(() => {
      this.thisComponent.onStateChange();
      //})
      //}
    };
    const view = () => {
      const arr = [];
      for (const child of this.props.children) {
        if (isCallable(child)) {
          arr.push(child(this.thisComponent.renderingError));
        } else {
          arr.push(child);
        }
      }
      this.thisComponent.renderingError = null;
      return arr;
    };
    this.view = view;
  }
  initProps({
    children = _error => Reblend.construct.bind(this)(Reblend, null, '')
  }, thisComponent) {
    this.props = {};
    this.props.children = children;
    this.thisComponent = thisComponent;
  }
  html() {
    return Reblend.construct.bind(this)("div", null, this.view());
  }
}
/* Transformed from function to class */
export { TryCatchError };