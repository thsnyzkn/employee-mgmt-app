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
          position: 'Developer',
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

describe('EmployeeForm Page', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    vi.clearAllMocks()
  })

  it('should render with default state', async () => {
    const template = html`<employee-form></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    expect(component).toBeTruthy()
    
    await component.updateComplete
    
    // Check form title
    const title = component.shadowRoot.querySelector('h2')
    expect(title.textContent).toBe('Add Employee')
  })

  it('should initialize with correct default properties', async () => {
    const template = html`<employee-form></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
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

  it('should fill form when employeeId is provided', async () => {
    const template = html`<employee-form employeeId="1"></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    expect(component.employee.firstName).toBe('John')
    expect(component.employee.lastName).toBe('Doe')
    expect(component.employee.department).toBe('Tech')
  })

  it('should handle form submission for adding employee', async () => {
    const { store, addEmployee } = await import('../../store')
    const { Router } = await import('@vaadin/router')

    const template = html`<employee-form></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    const form = component.shadowRoot.querySelector('form')
    form.dispatchEvent(new Event('submit'))
    
    expect(addEmployee).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalled()
    expect(Router.go).toHaveBeenCalledWith('/')
  })

  it('should handle form submission for updating employee', async () => {
    const { store, updateEmployee } = await import('../../store')
    const { Router } = await import('@vaadin/router')

    const template = html`<employee-form employeeId="1"></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    const form = component.shadowRoot.querySelector('form')
    form.dispatchEvent(new Event('submit'))
    
    expect(updateEmployee).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalled()
    expect(Router.go).toHaveBeenCalledWith('/')
  })

  it('should handle form cancellation', async () => {
    const { Router } = await import('@vaadin/router')

    const template = html`<employee-form></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    const cancelButton = component.shadowRoot.querySelector('.cancel')
    cancelButton.click()
    
    expect(Router.go).toHaveBeenCalledWith('/')
  })

  it('should validate required fields on submit', async () => {
    const template = html`<employee-form></employee-form>`
    render(template, container)
    
    const component = container.querySelector('employee-form')
    await component.updateComplete
    
    const form = component.shadowRoot.querySelector('form')
    
    const firstNameInput = form.querySelector('#firstName')
    const lastNameInput = form.querySelector('#lastName')
    
    const firstNameValidityBefore = firstNameInput.checkValidity()
    const lastNameValidityBefore = lastNameInput.checkValidity()
    
    form.dispatchEvent(new Event('submit'))
    
    const firstNameValidityAfter = firstNameInput.checkValidity()
    const lastNameValidityAfter = lastNameInput.checkValidity()
    
    expect(firstNameValidityBefore).toBe(false)
    expect(lastNameValidityBefore).toBe(false)
    expect(firstNameValidityAfter).toBe(false)
    expect(lastNameValidityAfter).toBe(false)
  })
})
