import React from 'react'
import Static from '@/Static'
import { renderToStaticMarkup } from 'react-dom/server'

describe('Static', () => {
  const children = <div className="children">test</div>
  it('should render wrapped', () => {
    const markup = renderToStaticMarkup(<Static>{children}</Static>)

    expect(markup).toBe(
      `<div style="display:contents">${renderToStaticMarkup(children)}</div>`
    )
  })

  it('should render wrapped as span', () => {
    const markup = renderToStaticMarkup(<Static as="span">{children}</Static>)

    expect(markup).toBe(
      `<span style="display:contents">${renderToStaticMarkup(children)}</span>`
    )
  })
})
