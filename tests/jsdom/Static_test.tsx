import React from 'react'
import Static from '@/Static'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Static', () => {
  const children = <div className="children">test</div>

  it('should be empty innerHTML', () => {
    const { container } = render(<Static>{children}</Static>, {
      container: document.createElement('div')
    })

    expect(
      container.querySelector('[style="display: contents;"]')
    ).not.toBeEmptyDOMElement()
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
