import { useMemo, useReducer } from 'reblendjs';

/**
 * Create a state setter pair for a boolean value that can be "switched".
 * Unlike `useState(false)`, `useToggleState` will automatically flip the state
 * value when its setter is called with no argument.
 *
 * @param initialState The initial boolean value
 * @returns A tuple of the current state and a setter
 *
 * ```jsx
 * const {show, toggleShow} = useToggleState(false)
 *
 * return (
 *   <>
 *     <button onClick={() => toggleShow()}>
 *       Toggle
 *     <button>
 *
 *     {show && <strong>Now you can see me</strong>}
 *   </>
 * )
 *
 * ```
 */
export default function useToggleState(initialState = false) {
  this.state.initialState = initialState;
  const [show, toggleShow] = useReducer.bind(this)((state, action) => action == null ? !state : action, this.state.initialState, "show");
  this.state.show = show;
  this.state.toggleShow = toggleShow;
  const toggleState = useMemo.bind(this)(() => ({
    show: this.state.show,
    toggleShow: this.state.toggleShow
  }), "toggleState", (() => [this.state.show]).bind(this));
  this.state.toggleState = toggleState;
  return {
    toggleState: this.state.toggleState
  };
}
/* @Reblend: Transformed from function to class */