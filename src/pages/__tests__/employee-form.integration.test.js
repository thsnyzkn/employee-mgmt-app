import { describe, it, expect, beforeEach, vi } from 'vitest'
import { html, render } from 'lit'
import '../employee-form.js'

// Mock the store
vi.mock('../../store', () => ({
  store: {
    getState: vi.fn(() => ({
      employees: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          department: 'Tech',
          position: 'Senior',
          dateOfEmployment: '2024-01-01',
          dateOfBirth: '1990-01-01',
          phone: '1234567890',
          email: 'john.doe@example.com'
        }
      ]
    })),
    dispatch: vi.fn()
  },
  addEmployee: vi.fn(),
  updateEmployee: vi.fn()
}))

// Mock the router
vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn()
  }
}))

describe('EmployeeForm Integration Tests', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    vi.clearAllMocks()
  })

  it('should render all form fields correctly', async () => {
    const template = html`<employee-form></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    const form = component.shadowRoot.querySelector('form')
    
    // Check all input fields exist
    expect(form.querySelector('#firstName')).toBeTruthy()
    expect(form.querySelector('#lastName')).toBeTruthy()
    expect(form.querySelector('#dateOfEmployment')).toBeTruthy()
    expect(form.querySelector('#dateOfBirth')).toBeTruthy()
    expect(form.querySelector('#phone')).toBeTruthy()
    expect(form.querySelector('#email')).toBeTruthy()
    expect(form.querySelector('#department')).toBeTruthy()
    expect(form.querySelector('#position')).toBeTruthy()
    
    // Check input types
    expect(form.querySelector('#firstName').type).toBe('text')
    expect(form.querySelector('#lastName').type).toBe('text')
    expect(form.querySelector('#dateOfEmployment').type).toBe('date')
    expect(form.querySelector('#dateOfBirth').type).toBe('date')
    expect(form.querySelector('#phone').type).toBe('tel')
    expect(form.querySelector('#email').type).toBe('email')
    
    // Check select options
    const departmentSelect = form.querySelector('#department')
    const positionSelect = form.querySelector('#position')
    
    expect(departmentSelect.querySelectorAll('option').length).toBe(3) // Including default
    expect(positionSelect.querySelectorAll('option').length).toBe(4) // Including default
  })

  it('should show correct form title based on mode', async () => {
    // Test add mode
    const addTemplate = html`<employee-form></employee-form>`
    render(addTemplate, container)
    
    const addComponent = container.querySelector('employee-form')
    await addComponent.updateComplete
    
    const addTitle = addComponent.shadowRoot.querySelector('h2')
    expect(addTitle.textContent.trim()).toBe('Add Employee')
    
    // Create a new container for edit mode to avoid Lit rendering conflicts
    const editContainer = document.createElement('div')
    document.body.appendChild(editContainer)
    
    const editTemplate = html`<employee-form employeeId="1"></employee-form>`
    render(editTemplate, editContainer)
    
    const editComponent = editContainer.querySelector('employee-form')
    await editComponent.updateComplete
    
    const editTitle = editComponent.shadowRoot.querySelector('h2')
    expect(editTitle.textContent.trim()).toBe('Edit Employee: John Doe')
    
    // Clean up
    document.body.removeChild(editContainer)
  })

  it('should update document title when editing employee', async () => {
    // Mock document.title
    const originalTitle = document.title
    
    const template = html`<employee-form employeeId="1"></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    // Trigger the updated lifecycle
    component.requestUpdate()
    await component.updateComplete
    
    expect(document.title).toBe('You are editing John Doe')
    
    // Restore original title
    document.title = originalTitle
  })

  it('should handle form data correctly on submit', async () => {
    const { store, addEmployee } = await import('../../store')
    
    const template = html`<employee-form></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    const form = component.shadowRoot.querySelector('form')
    
    // Fill form with test data
    form.querySelector('#firstName').value = 'Jane'
    form.querySelector('#lastName').value = 'Smith'
    form.querySelector('#dateOfEmployment').value = '2024-02-01'
    form.querySelector('#dateOfBirth').value = '1995-06-15'
    form.querySelector('#phone').value = '9876543210'
    form.querySelector('#email').value = 'jane.smith@example.com'
    form.querySelector('#department').value = 'Analytics'
    form.querySelector('#position').value = 'Senior'
    
    // Create and dispatch submit event
    const submitEvent = new Event('submit')
    Object.defineProperty(submitEvent, 'target', {
      value: form,
      writable: false
    })
    
    // Mock preventDefault
    submitEvent.preventDefault = vi.fn()
    
    component._handleSubmit(submitEvent)
    
    expect(submitEvent.preventDefault).toHaveBeenCalled()
    expect(addEmployee).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Smith',
        department: 'Analytics',
        position: 'Senior'
      })
    )
  })

  it('should populate form fields when editing existing employee', async () => {
    const template = html`<employee-form employeeId="1"></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    const form = component.shadowRoot.querySelector('form')
    
    // Check that form fields are populated
    expect(form.querySelector('#firstName').value).toBe('John')
    expect(form.querySelector('#lastName').value).toBe('Doe')
    expect(form.querySelector('#department').value).toBe('Tech')
    expect(form.querySelector('#position').value).toBe('Senior')
    expect(form.querySelector('#dateOfEmployment').value).toBe('2024-01-01')
    expect(form.querySelector('#dateOfBirth').value).toBe('1990-01-01')
    expect(form.querySelector('#phone').value).toBe('1234567890')
    expect(form.querySelector('#email').value).toBe('john.doe@example.com')
  })

  it('should handle employee not found scenario', async () => {
    const template = html`<employee-form employeeId="999"></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    // Employee should be empty object when not found
    expect(component.employee).toEqual({})
  })

  it('should have proper form validation attributes', async () => {
    const template = html`<employee-form></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    const form = component.shadowRoot.querySelector('form')
    
    // Check required attributes
    expect(form.querySelector('#firstName').required).toBe(true)
    expect(form.querySelector('#lastName').required).toBe(true)
    expect(form.querySelector('#dateOfEmployment').required).toBe(true)
    expect(form.querySelector('#dateOfBirth').required).toBe(true)
    expect(form.querySelector('#phone').required).toBe(true)
    expect(form.querySelector('#email').required).toBe(true)
    expect(form.querySelector('#department').required).toBe(true)
    expect(form.querySelector('#position').required).toBe(true)
  })

  it('should have correct button labels and classes', async () => {
    const template = html`<employee-form></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    const submitButton = component.shadowRoot.querySelector('button[type="submit"]')
    const cancelButton = component.shadowRoot.querySelector('button[type="button"]')
    
    expect(submitButton.textContent).toBe('Save')
    expect(submitButton.classList.contains('submit')).toBe(true)
    
    expect(cancelButton.textContent.trim()).toBe('Cancel')
    expect(cancelButton.classList.contains('cancel')).toBe(true)
  })

  it('should handle form reset when component is reused', async () => {
    const template = html`<employee-form employeeId="1"></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    // Verify employee is loaded
    expect(component.employee.firstName).toBe('John')
    
    // Change to add mode by updating the attribute
    component.employeeId = null
    component.requestUpdate('employeeId')
    await component.updateComplete
    
    // Employee should be reset to default
    expect(component.employee).toEqual({
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: ''
    })
  })
})
