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

type UseIntersection<T extends HTMLElement = HTMLElement> = {
  onIntersectIn?: (opt: {
    IntersectionObserverEntry: IntersectionObserverEntry
    IntersectionObserver: IntersectionObserver
    target: Element | null | undefined
  }) => void
  onIntersectOut?: (opt: {
    IntersectionObserverEntry: IntersectionObserverEntry
    IntersectionObserver: IntersectionObserver
    target: Element | null | undefined
  }) => void
  target?: (ref: T) => Element | null | undefined
} & IntersectionObserverInit

const useIntersection = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  {
    onIntersectIn,
    onIntersectOut,
    root,
    rootMargin,
    threshold,
    target
  }: UseIntersection
) => {
  useEffect(() => {
    if (!ref.current) return
    const el = target ? target(ref.current) : ref.current

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          onIntersectIn?.({
            IntersectionObserverEntry: entry,
            IntersectionObserver: obs,
            target: el
          })
        } else {
          onIntersectOut?.({
            IntersectionObserverEntry: entry,
            IntersectionObserver: obs,
            target: el
          })
        }
      },
      { root, rootMargin, threshold }
    )

    if (el) {
      observer.observe(el)
    }

    return observer.disconnect
  }, [root, rootMargin, threshold])
}

export { useFallback, useIntersection }
