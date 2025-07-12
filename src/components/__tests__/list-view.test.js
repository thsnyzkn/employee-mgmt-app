import { describe, it, expect, beforeEach, vi } from 'vitest'
import { html, render } from 'lit'
import '../list-view.js'

// Mock Router
vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn()
  }
}))

describe('ListView Component', () => {
  let container
  let mockEmployees

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    vi.clearAllMocks()

    mockEmployees = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-05-15',
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        department: 'Tech',
        position: 'Senior'
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfEmployment: '2023-03-15',
        dateOfBirth: '1985-12-10',
        phone: '987-654-3210',
        email: 'jane.smith@example.com',
        department: 'Analytics',
        position: 'Junior'
      }
    ]
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should render without employees', async () => {
    const template = html`<list-view .employees=${[]}></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const list = component.shadowRoot.querySelector('ol')
    expect(list).toBeTruthy()
    expect(list.children.length).toBe(0)
  })

  it('should render correct number of employee cards', async () => {
    const template = html`<list-view .employees=${mockEmployees}></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const listItems = component.shadowRoot.querySelectorAll('li')
    expect(listItems.length).toBe(2)
  })

  it('should display all employee properties correctly', async () => {
    const template = html`<list-view .employees=${[mockEmployees[0]]}></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const cardProperties = component.shadowRoot.querySelectorAll('card-property')
    
    // Should have 8 properties (excluding Actions)
    expect(cardProperties.length).toBe(8)

    // Check that properties are rendered with correct data
    const propertyValues = Array.from(cardProperties).map(prop => prop.title)
    expect(propertyValues).toContain('John')
    expect(propertyValues).toContain('Doe')
    expect(propertyValues).toContain('2024-01-01')
    expect(propertyValues).toContain('1990-05-15')
    expect(propertyValues).toContain('123-456-7890')
    expect(propertyValues).toContain('john.doe@example.com')
    expect(propertyValues).toContain('Tech')
    expect(propertyValues).toContain('Senior')
  })

  it('should have edit and delete buttons for each employee', async () => {
    const template = html`<list-view .employees=${mockEmployees}></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const actionContainers = component.shadowRoot.querySelectorAll('.actions-container')
    expect(actionContainers.length).toBe(2)

    actionContainers.forEach(container => {
      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBe(2)
      
      const editButton = buttons[0]
      const deleteButton = buttons[1]
      
      expect(editButton.textContent.trim()).toContain('Edit')
      expect(deleteButton.textContent.trim()).toContain('Delete')
    })
  })

  it('should navigate to edit page when edit button is clicked', async () => {
    const { Router } = await import('@vaadin/router')
    
    const template = html`<list-view .employees=${[mockEmployees[0]]}></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const editButton = component.shadowRoot.querySelector('.actions-container button:first-child')
    editButton.click()

    expect(Router.go).toHaveBeenCalledWith('/edit/1')
  })

  it('should dispatch delete-employee event when delete button is clicked', async () => {
    const template = html`<list-view .employees=${[mockEmployees[0]]}></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const eventSpy = vi.fn()
    component.addEventListener('delete-employee', eventSpy)

    const deleteButton = component.shadowRoot.querySelector('.actions-container button:last-child')
    deleteButton.click()

    expect(eventSpy).toHaveBeenCalledOnce()
    expect(eventSpy.mock.calls[0][0].detail).toEqual({ id: 1 })
  })

  it('should test getEmployeeValue method with all property types', async () => {
    const template = html`<list-view .employees=${[]}></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const testEmployee = mockEmployees[0]

    expect(component.getEmployeeValue(testEmployee, 'First Name')).toBe('John')
    expect(component.getEmployeeValue(testEmployee, 'Last Name')).toBe('Doe')
    expect(component.getEmployeeValue(testEmployee, 'Date of Employment')).toBe('2024-01-01')
    expect(component.getEmployeeValue(testEmployee, 'Date of Birth')).toBe('1990-05-15')
    expect(component.getEmployeeValue(testEmployee, 'Phone')).toBe('123-456-7890')
    expect(component.getEmployeeValue(testEmployee, 'Email')).toBe('john.doe@example.com')
    expect(component.getEmployeeValue(testEmployee, 'Department')).toBe('Tech')
    expect(component.getEmployeeValue(testEmployee, 'Position')).toBe('Senior')
    expect(component.getEmployeeValue(testEmployee, 'Unknown')).toBe('N/A')
  })

  it('should handle undefined employees gracefully', async () => {
    const template = html`<list-view></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const list = component.shadowRoot.querySelector('ol')
    expect(list).toBeTruthy()
    expect(list.children.length).toBe(0)
  })

  it('should render edit and delete icons correctly', async () => {
    const template = html`<list-view .employees=${[mockEmployees[0]]}></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const buttons = component.shadowRoot.querySelectorAll('.actions-container button')
    const editIcon = buttons[0].querySelector('img')
    const deleteIcon = buttons[1].querySelector('img')

    expect(editIcon).toBeTruthy()
    expect(deleteIcon).toBeTruthy()
    expect(editIcon.alt).toBe('Edit')
    expect(deleteIcon.alt).toBe('Delete')
  })

  it('should apply correct CSS classes to action buttons', async () => {
    const template = html`<list-view .employees=${[mockEmployees[0]]}></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const actionContainer = component.shadowRoot.querySelector('.actions-container')
    expect(actionContainer).toBeTruthy()

    const buttons = actionContainer.querySelectorAll('button')
    expect(buttons.length).toBe(2)
  })

  it('should handle multiple employees with different data', async () => {
    const template = html`<list-view .employees=${mockEmployees}></list-view>`
    render(template, container)

    const component = container.querySelector('list-view')
    await component.updateComplete

    const listItems = component.shadowRoot.querySelectorAll('li')
    expect(listItems.length).toBe(2)

    // Check first employee data
    const firstEmployeeCards = listItems[0].querySelectorAll('card-property')
    const firstEmployeeValues = Array.from(firstEmployeeCards).map(card => card.title)
    expect(firstEmployeeValues).toContain('John')
    expect(firstEmployeeValues).toContain('Tech')

    // Check second employee data  
    const secondEmployeeCards = listItems[1].querySelectorAll('card-property')
    const secondEmployeeValues = Array.from(secondEmployeeCards).map(card => card.title)
    expect(secondEmployeeValues).toContain('Jane')
    expect(secondEmployeeValues).toContain('Analytics')
  })
})
