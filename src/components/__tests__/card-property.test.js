import { describe, it, expect, beforeEach } from 'vitest'
import { html, render } from 'lit'
import '../card-property.js'

describe('CardProperty Component', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  it('should render with label and title', async () => {
    const template = html`
      <card-property 
        label="Employee Name" 
        title="John Doe">
      </card-property>
    `
    render(template, container)
    
    const component = container.querySelector('card-property')
    expect(component).toBeTruthy()
    
    // Wait for component to render
    await component.updateComplete
    
    // Check shadow DOM content
    const labelElement = component.shadowRoot.querySelector('#label')
    const titleElement = component.shadowRoot.querySelector('span:not(#label)')
    
    expect(labelElement.textContent).toBe('Employee Name')
    expect(titleElement.textContent).toBe('John Doe')
  })

  it('should update when properties change', async () => {
    const template = html`
      <card-property 
        label="Initial Label" 
        title="Initial Title">
      </card-property>
    `
    render(template, container)
    
    const component = container.querySelector('card-property')
    await component.updateComplete
    
    // Update properties
    component.label = 'Updated Label'
    component.title = 'Updated Title'
    await component.updateComplete
    
    const labelElement = component.shadowRoot.querySelector('#label')
    const titleElement = component.shadowRoot.querySelector('span:not(#label)')
    
    expect(labelElement.textContent).toBe('Updated Label')
    expect(titleElement.textContent).toBe('Updated Title')
  })

  it('should handle empty properties', async () => {
    const template = html`<card-property></card-property>`
    render(template, container)
    
    const component = container.querySelector('card-property')
    await component.updateComplete
    
    const labelElement = component.shadowRoot.querySelector('#label')
    const titleElement = component.shadowRoot.querySelector('span:not(#label)')
    
    expect(labelElement.textContent).toBe('')
    expect(titleElement.textContent).toBe('')
  })

  it('should have correct CSS structure', async () => {
    const template = html`
      <card-property 
        label="Test Label" 
        title="Test Title">
      </card-property>
    `
    render(template, container)
    
    const component = container.querySelector('card-property')
    await component.updateComplete
    
    // Check that wrapper div exists
    const wrapper = component.shadowRoot.querySelector('#wrapper')
    expect(wrapper).toBeTruthy()
    
    // Check that both spans exist
    const spans = component.shadowRoot.querySelectorAll('span')
    expect(spans.length).toBe(2)
  })
})
