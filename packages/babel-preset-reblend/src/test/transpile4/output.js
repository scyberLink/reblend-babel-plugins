import { useEffect, useReducer, useState } from 'reblendjs';
const matchersByWindow = new WeakMap();
const getMatcher = (query, targetWindow) => {
  if (!query || !targetWindow) return undefined;
  const matchers = matchersByWindow.get(targetWindow) || new Map();
  matchersByWindow.set(targetWindow, matchers);
  let mql = matchers.get(query);
  if (!mql) {
    mql = targetWindow.matchMedia(query);
    mql.refCount = 0;
    matchers.set(mql.media, mql);
  }
  return mql;
};
/**
 * Match a media query and get updates as the match changes. The media string is
 * passed directly to `window.matchMedia` and run as a Layout Effect, so initial
 * matches are returned before the browser has a chance to paint.
 *
 * ```tsx
 * function Page() {
 *   const {matches} = useMediaQuery('min-width: 1000px')
 *
 *   return matches ? "very wide" : 'not so wide'
 * }
 * ```
 *
 * Media query lists are also reused globally, hook calls for the same query
 * will only create a matcher once under the hood.
 *
 * @param query A media query
 * @param targetWindow The window to match against, uses the globally available one as a default.
 */
export default function useMediaQuery(query, targetWindow = typeof window === 'undefined' ? undefined : window) {
  let handleChange;
  this.state.handleChange = handleChange;
  let mql = getMatcher(query, targetWindow);
  this.state.mql = mql;
  let matchers = null;
  this.state.matchers = matchers;
  const [matches, setMatches] = useState.bind(this)(this.state.mql ? this.state.mql.matches : false, "matches");
  this.state.matches = matches;
  this.state.setMatches = setMatches;
  const [_query, setQuery] = useReducer.bind(this)((state, action) => {
    let m = getMatcher(action, targetWindow);
    if (!m) {
      return this.state.setMatches(false);
    }
    this.state.mql = m;
    this.state.matchers = matchersByWindow.get(targetWindow);
    this.state.handleChange = () => {
      this.state.setMatches(this.state.mql.matches);
    };
    this.state.mql.refCount++;
    this.state.mql.addListener(this.state.handleChange);
    this.state.handleChange();
    return action;
  }, null, "_query");
  this.state._query = _query;
  this.state.setQuery = setQuery;
  this.state.setQuery(query);
  useEffect.bind(this)(() => {
    return () => {
      if (!this.state.mql) return;
      this.state.mql.removeListener(this.state.handleChange);
      this.state.mql.refCount--;
      if (this.state.mql.refCount <= 0) {
        this.state.matchers.delete(this.state.mql.media);
      }
      this.state.mql = undefined;
    };
  }, (() => [this.state._query]).bind(this));
  const useMediaQueryReturnObject = {
    matches: this.state.matches,
    setQuery: this.state.setQuery
  };
  this.state.useMediaQueryReturnObject = useMediaQueryReturnObject;
  useEffect.bind(this)(() => {
    this.state.useMediaQueryReturnObject.matches = this.state.matches;
  }, (() => this.state.matches).bind(this));
  return this.state.useMediaQueryReturnObject;
}
/* @Reblend: Transformed from function to class */