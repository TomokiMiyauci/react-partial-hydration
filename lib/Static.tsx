import { useEffect, useRef, createElement, Fragment } from 'react'
import { hydrate } from 'react-dom'
import { isServer } from '@/utils'
import { display, DEFAULT_PROPS } from '@/constants'
import type { ReactNode, ReactHTML } from 'react'

type Props<T extends keyof ReactHTML> = {
  children: ReactNode
  fallback?: boolean | ReactNode
  as?: T
  onFallback?: () => void
}

const Static = <T extends keyof ReactHTML>({
  children,
  fallback = true,
  as,
  onFallback
}: Props<T>) => {
  const ref = useRef<HTMLDivElement>(null)
  const _as = as ?? 'div'

  useEffect(() => {
    if (!ref.current || !ref.current.innerHTML) {
      if (fallback) {
        const component = typeof fallback === 'boolean' ? children : fallback

        hydrate(createElement(Fragment, {}, component), ref.current)
        onFallback?.()
      }
    }
  }, [])

  if (isServer)
    return createElement(
      _as,
      {
        style: {
          display
        }
      },
      children
    )

  return createElement(_as, {
    ...DEFAULT_PROPS,
    ref,
    style: {
      display
    }
  })
}

export default Static
