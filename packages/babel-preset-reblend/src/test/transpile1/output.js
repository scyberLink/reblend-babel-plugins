"use strict";

exports.__esModule = true;
exports.default = useDebouncedState;
var _reblendjs = require("reblendjs");
var _useDebouncedCallback = require("./useDebouncedCallback.js");
//@ts-ignore
/**
 * Similar to `useState`, except the setter function is debounced by
 * the specified delay. Unlike `useState`, the returned setter is not "pure" having
 * the side effect of scheduling an update in a timeout, which makes it unsafe to call
 * inside of the component render phase.
 *
 * ```ts
 * const [value, setValue] = useDebouncedState('test', 500)
 *
 * setValue('test2')
 * ```
 *
 * @param initialState initial state value
 * @param delayOrOptions The milliseconds delay before a new value is set, or options object
 */
function useDebouncedState(initialState, delayOrOptions) {
  const [state, setState] = _reblendjs.useState.bind(this)(initialState, "state");
  this.state.state = state;
  this.state.setState = setState;
  const {
    callback
  } = _useDebouncedCallback.default.bind(this)(this.state.setState, delayOrOptions);
  this.state.callback = callback;
  return {
    state: this.state.state,
    debouncedSetState: this.state.callback
  };
}
/* @Reblend: Transformed from function to class */