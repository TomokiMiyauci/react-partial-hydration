import { createElement } from 'react'
import { useFallback } from '@/hooks'
import { createRef } from 'react'
import { renderHook } from '@testing-library/react-hooks'

describe('useFallback', () => {
  it('should trigger afterRender event', () => {
    const fn = jest.fn()
    const mockRenderer = jest.fn()
    const ref = createRef<HTMLElement>()

    renderHook(() =>
      useFallback(
        ref,
        {
          fallback: createElement('div'),
          afterRender: fn,
          renderer: mockRenderer
        },
        []
      )
    )

    expect(mockRenderer).toHaveBeenCalled()
    expect(fn).toHaveBeenCalled()
  })

  it('should not trigger afterRender event when fallback component does not define', () => {
    const fn = jest.fn()
    const mockRenderer = jest.fn()
    const ref = createRef<HTMLElement>()

    renderHook(() =>
      useFallback(
        ref,
        {
          fallback: false,
          afterRender: fn,
          renderer: mockRenderer
        },
        []
      )
    )

    expect(mockRenderer).not.toHaveBeenCalled()
    expect(fn).not.toHaveBeenCalled()
  })
})
