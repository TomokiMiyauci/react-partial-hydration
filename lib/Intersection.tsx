import { useRef, createElement, useEffect } from 'react'
import { isServer } from '@/utils'
import { display, DEFAULT_PROPS } from '@/constants'
import { useFallback } from '@/hooks'
import { hydrate } from 'react-dom'
import type { ReactHTML, DetailedHTMLProps, HTMLAttributes } from 'react'

type IntersectionProps<T extends keyof ReactHTML> = {
  children: JSX.Element
  as?: T
  /** When DOM is not exists, fallback to children or passed component */
  fallback?: false | JSX.Element
  /** On fallback component is rendered, then fire */
  onFallback?: () => void
  keepRender?: boolean
} & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> &
  IntersectionObserverInit

/**
 * Lazy hydration component until intersection
 *
 * @example
 * ```tsx
 * <Intersection>
 *  <div>This do not hydrate</div>
 * </Intersection>
 * ```
 */
const Intersection = <T extends keyof ReactHTML>({
  children,
  fallback = children,
  as,
  onFallback,
  style,
  keepRender = true,
  root,
  rootMargin,
  threshold,
  ...props
}: IntersectionProps<T>) => {
  const ref = useRef<HTMLDivElement>(null)
  const _as = as ?? 'div'

  useFallback(
    ref,
    {
      fallback
    },
    []
  )

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          hydrate(children, ref.current)
          if (keepRender && ref.current) {
            obs.unobserve(ref.current)
          }
        } else {
          // keep
        }
      },
      { root, rootMargin, threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [root, rootMargin, threshold])

  if (isServer)
    return createElement(
      _as,
      {
        style: {
          display,
          ...style
        },
        ...props
      },
      children
    )

  return createElement(_as, {
    ref,
    style: {
      display,
      ...style
    },
    ...props,
    ...DEFAULT_PROPS
  })
}

export default Intersection
