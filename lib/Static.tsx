import { useRef, createElement } from 'react'
import { isServer as _isServer } from '@/utils'
import { display, DEFAULT_PROPS } from '@/constants'
import { useFallback } from '@/hooks'
import type { ReactHTML, DetailedHTMLProps, HTMLAttributes } from 'react'

type StaticProps<T extends keyof ReactHTML> = {
  /** The children component */
  children: JSX.Element
  /** `Static` component should render as */
  as?: T
  /** When DOM is not exists, fallback to children or passed component */
  fallback?: false | JSX.Element
  /** On fallback component is rendered, then fire */
  onFallback?: () => void
  /** For debugging, switch rendering environment server side or client side */
  isServer?: boolean
} & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

/**
 * Skip hydration component with fallback renderer
 *
 * @example
 * ```tsx
 * <Static>
 *  <div>This do not hydrate</div>
 * </Static>
 * ```
 */
const Static = <T extends keyof ReactHTML>({
  children,
  as,
  fallback = children,
  onFallback,
  style,
  isServer = _isServer,
  ...props
}: StaticProps<T>): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const _as = as ?? 'div'

  useFallback(
    ref,
    {
      fallback,
      afterRender: onFallback
    },
    []
  )

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

export default Static
