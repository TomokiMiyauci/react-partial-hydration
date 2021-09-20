import type { CSSProperties, HTMLAttributes } from 'react'

export const display: CSSProperties['display'] = 'contents'
export const DEFAULT_PROPS: HTMLAttributes<HTMLElement> = {
  suppressHydrationWarning: true,
  dangerouslySetInnerHTML: {
    __html: ''
  }
}
