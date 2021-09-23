import Static from '@/Static'
import { renderToStaticMarkup } from 'react-dom/server'

describe('Static', () => {
  const children = <div className="children">test</div>
  it('should render default html', () => {
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

  it('should render with HTML attribute', () => {
    const markup = renderToStaticMarkup(
      <Static title="test">{children}</Static>
    )

    expect(markup).toBe(
      `<div style="display:contents" title="test">${renderToStaticMarkup(
        children
      )}</div>`
    )
  })

  it('should render style attribute with default display style', () => {
    const html = renderToStaticMarkup(
      <Static style={{ height: '100vh' }}>{children}</Static>
    )

    expect(html).toBe(
      `<div style="display:contents;height:100vh">${renderToStaticMarkup(
        children
      )}</div>`
    )
  })

  it('should override display style ', () => {
    const html = renderToStaticMarkup(
      <Static style={{ display: 'block' }}>{children}</Static>
    )

    expect(html).toBe(
      `<div style="display:block">${renderToStaticMarkup(children)}</div>`
    )
  })
})
