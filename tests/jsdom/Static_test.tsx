import React from 'react'
import Static from '@/Static'
import { render } from '@testing-library/react'

describe('Static', () => {
  const children = (
    <div data-testid="children" className="children">
      test
    </div>
  )

  it('should fallback to children when hydrated HTML is not exists', () => {
    const onFallback = jest.fn()
    const { container } = render(
      <Static onFallback={onFallback}>{children}</Static>,
      {
        container: document.createElement('div')
      }
    )

    expect(
      container.querySelector('[style="display: contents;"]')
    ).not.toBeEmptyDOMElement()
    expect(onFallback).toHaveBeenCalled()
  })

  it('should fallback to another component when pass fallback props', () => {
    const textContent = 'This is fallback'
    const html = render(
      <Static fallback={<div data-testid="fallback">{textContent}</div>}>
        {children}
      </Static>,
      {
        container: document.createElement('div')
      }
    )

    expect(html.getByTestId('fallback')).toHaveTextContent(textContent)
  })

  it('should fallback to children with style props', () => {
    const html = render(
      <Static data-testid="static" style={{ height: '100vh' }}>
        {children}
      </Static>
    )

    expect(html.getByTestId('static')).toHaveStyle({
      display: 'contents',
      height: '100vh'
    })
  })

  it('should fallback to children with override display style', () => {
    const html = render(
      <Static data-testid="static" style={{ display: 'block' }}>
        {children}
      </Static>
    )

    expect(html.getByTestId('static')).toHaveStyle({
      display: 'block'
    })
  })

  it('should be render any HTMLElement attribute', async () => {
    const title = 'test'
    const html = render(<Static title={title}>{children}</Static>, {
      container: document.createElement('div')
    })

    expect(await html.findByTitle(title)).not.toBeEmptyDOMElement()
    const dom = await html.findByTitle(title)
    expect(dom.title).toBe(title)
  })
})
