import { describe, it, expect, beforeEach, vi } from 'vitest'
import { html, render } from 'lit'
import '../confirm-modal.js'

describe('ConfirmModal Component', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  it('should render with message', async () => {
    const template = html`
      <confirm-modal 
        message="Are you sure you want to delete this item?">
      </confirm-modal>
    `
    render(template, container)
    
    const component = container.querySelector('confirm-modal')
    expect(component).toBeTruthy()
    
    await component.updateComplete
    
    // Check message is displayed
    const messageElement = component.shadowRoot.querySelector('p')
    expect(messageElement.textContent).toBe('Are you sure you want to delete this item?')
  })

  it('should have confirm and cancel buttons', async () => {
    const template = html`
      <confirm-modal message="Test message">
      </confirm-modal>
    `
    render(template, container)
    
    const component = container.querySelector('confirm-modal')
    await component.updateComplete
    
    const buttons = component.shadowRoot.querySelectorAll('button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].textContent.trim()).toBe('Confirm')
    expect(buttons[1].textContent.trim()).toBe('Cancel')
  })

  it('should call onConfirm when confirm button is clicked', async () => {
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    
    const template = html`
      <confirm-modal 
        message="Test message"
        .onConfirm=${mockOnConfirm}
        .onCancel=${mockOnCancel}>
      </confirm-modal>
    `
    render(template, container)
    
    const component = container.querySelector('confirm-modal')
    await component.updateComplete
    
    const confirmButton = component.shadowRoot.querySelector('button')
    confirmButton.click()
    
    expect(mockOnConfirm).toHaveBeenCalledOnce()
    expect(mockOnCancel).not.toHaveBeenCalled()
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    
    const template = html`
      <confirm-modal 
        message="Test message"
        .onConfirm=${mockOnConfirm}
        .onCancel=${mockOnCancel}>
      </confirm-modal>
    `
    render(template, container)
    
    const component = container.querySelector('confirm-modal')
    await component.updateComplete
    
    const buttons = component.shadowRoot.querySelectorAll('button')
    const cancelButton = buttons[1]
    cancelButton.click()
    
    expect(mockOnCancel).toHaveBeenCalledOnce()
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('should have correct modal structure', async () => {
    const template = html`
      <confirm-modal message="Test message">
      </confirm-modal>
    `
    render(template, container)
    
    const component = container.querySelector('confirm-modal')
    await component.updateComplete
    
    // Check modal structure
    const overlay = component.shadowRoot.querySelector('.modal-overlay')
    const content = component.shadowRoot.querySelector('.modal-content')
    const actions = component.shadowRoot.querySelector('.modal-actions')
    
    expect(overlay).toBeTruthy()
    expect(content).toBeTruthy()
    expect(actions).toBeTruthy()
  })

  it('should update message when property changes', async () => {
    const template = html`
      <confirm-modal message="Initial message">
      </confirm-modal>
    `
    render(template, container)
    
    const component = container.querySelector('confirm-modal')
    await component.updateComplete
    
    // Update message
    component.message = 'Updated message'
    await component.updateComplete
    
    const messageElement = component.shadowRoot.querySelector('p')
    expect(messageElement.textContent).toBe('Updated message')
  })
})
