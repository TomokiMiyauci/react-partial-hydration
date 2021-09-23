import Static from '@/Static'
import { render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useState } from 'react'

describe('Static', () => {
  const children = (
    <div data-testid="children" className="children">
      test
    </div>
  )

  it('should keep dom tree when markup HTML on server side is same client side parent HTML tag', () => {
    const container = document.createElement('div')
    container.innerHTML = renderToStaticMarkup(
      <Static isServer>{children}</Static>
    )
    document.body.appendChild(container)

    const html = render(<Static>{children}</Static>, {
      container,
      hydrate: true
    })

    expect(html.queryByTestId('children')).not.toBeNull()
    expect(html.getByTestId('children')).toHaveClass('children')
    expect(html.getByTestId('children')).toHaveTextContent('test')
  })

  it('should keep dom tree when markup HTML on server side is same client side parent HTML tag and attributes', () => {
    const container = document.createElement('div')
    const props = {
      as: 'span' as const,
      title: 'parent',
      'data-testid': 'parent',
      style: { display: 'block' }
    }
    container.innerHTML = renderToStaticMarkup(
      <Static {...props} isServer>
        {children}
      </Static>
    )
    document.body.appendChild(container)

    const html = render(<Static {...props}>{children}</Static>, {
      container,
      hydrate: true
    })

    expect(html.queryByTestId('parent')).not.toBeNull()
    expect(html.getByTestId('parent')).toHaveAttribute('title', 'parent')
    expect(html.getByTestId('parent')).toHaveStyle({
      display: 'block'
    })
    expect(html.getByTestId('parent')).not.toHaveStyle({
      display: 'contents'
    })
  })

  it('should have style attributes when markup HTML on server side is same client side parent HTML tag and style attribute', () => {
    const container = document.createElement('div')
    const props = {
      style: { height: '100vh', width: '100vw' },
      'data-testid': 'parent'
    }
    container.innerHTML = renderToStaticMarkup(
      <Static {...props} isServer>
        {children}
      </Static>
    )
    document.body.appendChild(container)

    const html = render(<Static {...props}>{children}</Static>, {
      container,
      hydrate: true
    })

    expect(html.getByTestId('parent')).toHaveStyle({
      display: 'contents',
      height: '100vh',
      width: '100vw'
    })
  })

  it('should not fire onFallback when markup HTML on server side is same client side parent HTML tag', () => {
    const onFallback = jest.fn()
    const container = document.createElement('div')
    container.innerHTML = renderToStaticMarkup(
      <Static isServer>{children}</Static>
    )
    document.body.appendChild(container)

    render(<Static onFallback={onFallback}>{children}</Static>, {
      container,
      hydrate: true
    })

    expect(onFallback).not.toHaveBeenCalled()
  })

  it('should not reactive when fallback component do not render', () => {
    const Children = ({ ssr }: { ssr?: boolean }): JSX.Element => {
      const [state] = useState(() => (ssr ? 1 : 0))

      return <div data-testid="children">{state}</div>
    }

    const onFallback = jest.fn()
    const container = document.createElement('div')
    container.innerHTML = renderToStaticMarkup(
      <Static isServer>
        <Children ssr />
      </Static>
    )
    document.body.appendChild(container)

    const html = render(
      <Static onFallback={onFallback}>
        <Children />
      </Static>,
      {
        container,
        hydrate: true
      }
    )

    expect(onFallback).not.toHaveBeenCalled()
    expect(html.getByTestId('children')).toHaveTextContent('1')
  })

  it('should reactive when fallback component render', () => {
    const Children = ({ ssr }: { ssr?: boolean }): JSX.Element => {
      const [state] = useState(() => (ssr ? 1 : 0))

      return <div data-testid="children">{state}</div>
    }

    const onFallback = jest.fn()
    const container = document.createElement('div')
    container.innerHTML = renderToStaticMarkup(
      <Static isServer>
        <Children />
      </Static>
    )
    document.body.appendChild(container)

    const html = render(
      <Static as="span" onFallback={onFallback}>
        <Children ssr />
      </Static>,
      {
        container,
        hydrate: true
      }
    )
    expect(onFallback).toHaveBeenCalled()
    expect(html.getByTestId('children')).toHaveTextContent('1')
  })
})
