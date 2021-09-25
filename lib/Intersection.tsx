import { useRef, createElement, Fragment, cloneElement } from 'react'
import { hydrate } from 'react-dom'
import { display, DEFAULT_PROPS } from '@/constants'
import { isServer as _isServer } from '@/utils'
import { useFallback, useIntersection } from '@/hooks'
import type { ReactHTML, DetailedHTMLProps, HTMLAttributes } from 'react'

type IntersectionProps<T extends keyof ReactHTML> = {
  /** The children component */
  children: JSX.Element
  /** `Intersection` component should render as */
  as?: T
  /** When DOM is not exists, fallback to children or passed component */
  fallback?: false | JSX.Element
  /** On fallback component is rendered, then fire */
  onFallback?: () => void
  /** Target used for intersection */
  target?: JSX.Element
  /** For debugging, switch rendering environment server side or client side */
  isServer?: boolean
} & IntersectionObserverInit &
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

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
  isServer = _isServer,
  root,
  rootMargin,
  threshold,
  ...props
}: IntersectionProps<T>): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const _as = as ?? 'div'
  const targetWithKey = cloneElement(target, { key: 'target' })
  const childrenWithKey = cloneElement(children, { key: 'children' })

  useFallback(
    ref,
    {
      fallback: createElement(Fragment, null, [targetWithKey, fallback]),
      afterRender: onFallback
    },
    []
  )

  useIntersection(ref, {
    onIntersectIn: ({ IntersectionObserver, target: _target }) => {
      if (_target) {
        IntersectionObserver.unobserve(_target)
      }
      hydrate(
        createElement(Fragment, null, [targetWithKey, childrenWithKey]),
        ref.current
      )
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
      [targetWithKey, childrenWithKey]
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
