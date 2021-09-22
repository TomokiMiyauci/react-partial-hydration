import { useRef, createElement, Fragment, CSSProperties } from 'react'
import { hydrate } from 'react-dom'
import { display, DEFAULT_PROPS } from '@/constants'
import { isServer } from '@/utils'
import { useFallback, useIntersection } from '@/hooks'
import type { ReactHTML } from 'react'

type IntersectionProps<T extends keyof ReactHTML> = {
  children: JSX.Element
  as?: T
  /** When DOM is not exists, fallback to children or passed component */
  fallback?: false | JSX.Element
  /** On fallback component is rendered, then fire */
  onFallback?: () => void
  target?: JSX.Element
  style?: CSSProperties
} & IntersectionObserverInit

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
  target = <div />,
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
      fallback: createElement(Fragment, null, [target, fallback])
    },
    []
  )

  useIntersection(ref, {
    onIntersectIn: ({ IntersectionObserver, target: _target }) => {
      if (_target) {
        IntersectionObserver.unobserve(_target)
      }
      hydrate(createElement(Fragment, null, [target, children]), ref.current)
    },
    target: (ref) => ref.firstElementChild
  })

  if (isServer) {
    return createElement(
      _as,
      {
        style: {
          display,
          ...style
        },
        ...props
      },
      [target, children]
    )
  }

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
