import { useRef, createElement } from 'react'
import { isServer } from '@/utils'
import { display, DEFAULT_PROPS } from '@/constants'
import { useFallback } from '@/hooks'
import type { ReactHTML, DetailedHTMLProps, HTMLAttributes } from 'react'

type Props<T extends keyof ReactHTML> = {
  children: JSX.Element
  as?: T
  /** When DOM is not exists, fallback to children or passed component */
  fallback?: false | JSX.Element
  /** On fallback component is rendered, then fire */
  onFallback?: () => void
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
  fallback = children,
  as,
  onFallback,
  style,
  ...props
}: Props<T>) => {
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
