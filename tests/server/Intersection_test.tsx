import Intersection from '@/Intersection'
import { renderToStaticMarkup } from 'react-dom/server'

describe('Intersection', () => {
  const table: [JSX.Element, string][] = [
    [<></>, '<div style="display:contents"><div></div></div>'],
    [<div />, '<div style="display:contents"><div></div><div></div></div>'],
    [
      <span data-testid="test" />,
      '<div style="display:contents"><div></div><span data-testid="test"></span></div>'
    ]
  ]
  it.each(table)('should render children as', (children, expected) => {
    const html = renderToStaticMarkup(<Intersection>{children}</Intersection>)

    expect(html).toBe(expected)
  })

  it('should render as span', () => {
    const html = renderToStaticMarkup(
      <Intersection as="span">
        <></>
      </Intersection>
    )

    expect(html).toBe(`<span style="display:contents"><div></div></span>`)
  })

  it('should render target', () => {
    const html = renderToStaticMarkup(
      <Intersection target={<span className="border" />}>
        <></>
      </Intersection>
    )

    expect(html).toBe(
      `<div style="display:contents"><span class="border"></span></div>`
    )
  })

  it('should overwrite style display', () => {
    const html = renderToStaticMarkup(
      <Intersection style={{ display: 'block' }}>
        <></>
      </Intersection>
    )

    expect(html).toBe(`<div style="display:block"><div></div></div>`)
  })

  it('should pass style', () => {
    const html = renderToStaticMarkup(
      <Intersection style={{ height: '100vh' }}>
        <></>
      </Intersection>
    )

    expect(html).toBe(
      `<div style="display:contents;height:100vh"><div></div></div>`
    )
  })

  it('should pass any props', () => {
    const html = renderToStaticMarkup(
      <Intersection className="test" title="test" aria-label="test">
        <></>
      </Intersection>
    )

    expect(html).toBe(
      `<div style="display:contents" class="test" title="test" aria-label="test"><div></div></div>`
    )
  })
})
