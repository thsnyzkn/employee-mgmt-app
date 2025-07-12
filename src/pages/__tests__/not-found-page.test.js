import { describe, it, expect, beforeEach } from 'vitest'
import { html, render } from 'lit'
import '../not-found-page.js'

describe('NotFoundPage', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  it('should render the not found message', async () => {
    const template = html`<not-found-page></not-found-page>`
    render(template, container)
    
    const component = container.querySelector('not-found-page')
    expect(component).toBeTruthy()
    
    await component.updateComplete
    
    // Check the content
    const content = component.shadowRoot.querySelector('div')
    expect(content.textContent).toBe('NOT FOUND')
  })

  it('should be a simple component with minimal structure', async () => {
    const template = html`<not-found-page></not-found-page>`
    render(template, container)
    
    const component = container.querySelector('not-found-page')
    await component.updateComplete
    
    // Should only have one div element
    const divs = component.shadowRoot.querySelectorAll('div')
    expect(divs.length).toBe(1)
    
    // Should have no styles defined
    expect(component.constructor.styles).toBeUndefined()
  })
})
