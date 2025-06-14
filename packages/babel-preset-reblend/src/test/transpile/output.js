//@ts-ignore
import { useState } from 'reblendjs';
import useDebouncedCallback

//@ts-ignore
from './useDebouncedCallback.js';

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
export default function useDebouncedState(initialState, delayOrOptions) {
  this.state.initialState = initialState;
  this.state.delayOrOptions = delayOrOptions;
  const [state, setState] = useState.bind(this)(this.state.initialState, "state");
  this.state.state = state;
  this.state.setState = setState;
  const {
    callback
  } = useDebouncedCallback.bind(this)(this.state.setState, this.state.delayOrOptions);
  this.state.callback = callback;
  return {
    state: this.state.state,
    debouncedSetState: this.state.callback
  };
}
/* @Reblend: Transformed from function to class */