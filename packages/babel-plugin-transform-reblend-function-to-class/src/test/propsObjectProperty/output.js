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
    this.thiz.renderingErrorHandler = e => {
      this.thiz.renderingError = e;
      //if (!this.stateEffectRunning && this.attached) {
      //Promise.resolve().then(() => {
      this.thiz.onStateChange();
      //})
      //}
    };
    const view = () => {
      const arr = [];
      for (const child of this.props.children) {
        if (isCallable(child)) {
          arr.push(child(this.thiz.renderingError));
        } else {
          arr.push(child);
        }
      }
      this.thiz.renderingError = null;
      return arr;
    };
    this.view = view;
  }
  initProps(thiz, {
    children = _error => Reblend.construct.bind(this)(Reblend, null, '')
  }) {
    this.props = {};
    this.thiz = thiz;
    this.props.children = children;
  }
  html() {
    return Reblend.construct.bind(this)("div", null, this.view());
  }
}
/* Transformed from function to class */
export { TryCatchError };