import { useEffect } from 'react'
import { hydrate, render } from 'react-dom'

import type { RefObject, DependencyList } from 'react'

type UseFallbackOptions = {
  renderer?: typeof hydrate | typeof render
  fallback: false | JSX.Element
  afterRender?: () => void
}

/**
 * Hooks for rendering fallback
 * @param ref - The root Ref
 * @param options - Fallback options
 * @param deps - If present, effect will only activate if the values in the list change
 */
const useFallback = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  { renderer = hydrate, fallback, afterRender }: UseFallbackOptions,
  deps?: DependencyList
) => {
  useEffect(() => {
    if (ref.current && ref.current.innerHTML) return

    if (fallback) {
      renderer(fallback, ref.current)
      afterRender?.()
    }
  }, deps)
}

export { useFallback }
