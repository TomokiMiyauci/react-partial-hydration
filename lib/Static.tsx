import { useEffect, useRef, createElement, Fragment } from 'react'
import { hydrate } from 'react-dom'
import { isServer } from '@/utils'
import { display, DEFAULT_PROPS } from '@/constants'
import type {
  ReactNode,
  ReactHTML,
  DetailedHTMLProps,
  HTMLAttributes
} from 'react'

type Props<T extends keyof ReactHTML> = {
  children: ReactNode
  fallback?: boolean | ReactNode
  as?: T
  onFallback?: () => void
} & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

const Static = <T extends keyof ReactHTML>({
  children,
  fallback = true,
  as,
  onFallback,
  ...props
}: Props<T>) => {
  const ref = useRef<HTMLDivElement>(null)
  const _as = as ?? 'div'

  useEffect(() => {
    if (ref.current && ref.current.innerHTML) return
    if (fallback) {
      const component = typeof fallback === 'boolean' ? children : fallback

      hydrate(createElement(Fragment, {}, component), ref.current)
      onFallback?.()
    }
  }, [])

  if (isServer)
    return createElement(
      _as,
      {
        style: {
          display
        },
        ...props
      },
      children
    )

  return createElement(_as, {
    ref,
    style: {
      display
    },
    ...props,
    ...DEFAULT_PROPS
  })
}

export default Static
