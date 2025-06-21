import { useEffect, useReducer, useState } from 'reblendjs'

interface RefCountedMediaQueryList extends MediaQueryList {
  refCount: number
}
const matchersByWindow = new WeakMap<
  Window,
  Map<string, RefCountedMediaQueryList>
>()

const getMatcher = (
  query: string | null,
  targetWindow?: Window,
): RefCountedMediaQueryList | undefined => {
  if (!query || !targetWindow) return undefined

  const matchers =
    matchersByWindow.get(targetWindow) ||
    new Map<string, RefCountedMediaQueryList>()

  matchersByWindow.set(targetWindow, matchers)

  let mql = matchers.get(query)
  if (!mql) {
    mql = targetWindow.matchMedia(query) as RefCountedMediaQueryList
    mql.refCount = 0
    matchers.set(mql.media, mql)
  }
  return mql
}
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
export default function useMediaQuery(
  query: string | null,
  targetWindow: Window | undefined = typeof window === 'undefined'
    ? undefined
    : window,
) {
  let handleChange: any
  let mql = getMatcher(query, targetWindow)
  let matchers: any = null
  const [matches, setMatches] = useState(mql ? mql.matches : false)
  const [_query, setQuery] = useReducer<typeof query, typeof query>(
    (state, action) => {
      let m = getMatcher(action, targetWindow)
      if (!m) {
        return setMatches(false)
      }
      mql = m
      matchers = matchersByWindow.get(targetWindow!)

      handleChange = () => {
        setMatches(mql!.matches)
      }

      mql.refCount++
      mql.addListener(handleChange)

      handleChange()

      return action as any
    },
    null,
  )
  
  setQuery(query)

  useEffect(() => {
    return () => {
      if (!mql) return
      mql.removeListener(handleChange)
      mql.refCount--
      if (mql.refCount <= 0) {
        matchers.delete(mql!.media)
      }
      mql = undefined
    }
  }, [_query])

  const useMediaQueryReturnObject = { matches, setQuery }

  useEffect(() => {
    useMediaQueryReturnObject.matches = matches
  }, matches)

  return useMediaQueryReturnObject
}
