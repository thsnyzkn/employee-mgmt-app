import { describe, it, expect, beforeEach, vi } from 'vitest'
import { html, render } from 'lit'
import '../table-view.js'

// Mock Router
vi.mock('@vaadin/router', () => ({
  Router: {
    go: vi.fn()
  }
}))

describe('TableView Component', () => {
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
      },
      {
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        dateOfEmployment: '2022-06-20',
        dateOfBirth: '1988-03-25',
        phone: '555-123-4567',
        email: 'bob.johnson@example.com',
        department: 'Tech',
        position: 'Medior'
      }
    ]
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should render table with correct headers', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const table = component.shadowRoot.querySelector('table')
    expect(table).toBeTruthy()

    const headerCells = component.shadowRoot.querySelectorAll('thead th')
    expect(headerCells.length).toBe(10) // 1 checkbox + 9 property columns

    const headerTexts = Array.from(headerCells).slice(1).map(th => th.textContent.trim())
    expect(headerTexts).toEqual([
      'First Name', 'Last Name', 'Date of Employment', 'Date of Birth',
      'Phone', 'Email', 'Department', 'Position', 'Actions'
    ])
  })

  it('should render correct number of employee rows', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const bodyRows = component.shadowRoot.querySelectorAll('tbody tr')
    expect(bodyRows.length).toBe(3)
  })

  it('should display employee data correctly in table rows', async () => {
    const template = html`<table-view .employees=${[mockEmployees[0]]}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const firstRow = component.shadowRoot.querySelector('tbody tr')
    const cells = firstRow.querySelectorAll('td')

    // Skip first cell (checkbox) and last cell (actions)
    expect(cells[1].textContent.trim()).toBe('John')
    expect(cells[2].textContent.trim()).toBe('Doe')
    expect(cells[3].textContent.trim()).toBe('2024-01-01')
    expect(cells[4].textContent.trim()).toBe('1990-05-15')
    expect(cells[5].textContent.trim()).toBe('123-456-7890')
    expect(cells[6].textContent.trim()).toBe('john.doe@example.com')
    expect(cells[7].textContent.trim()).toBe('Tech')
    expect(cells[8].textContent.trim()).toBe('Senior')
  })

  it('should handle empty employee list', async () => {
    const template = html`<table-view .employees=${[]}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const table = component.shadowRoot.querySelector('table')
    expect(table).toBeTruthy()

    const bodyRows = component.shadowRoot.querySelectorAll('tbody tr')
    expect(bodyRows.length).toBe(0)

    const masterCheckbox = component.shadowRoot.querySelector('thead input[type="checkbox"]')
    expect(masterCheckbox.checked).toBe(false)
  })

  it('should handle individual row checkbox selection', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const eventSpy = vi.fn()
    component.addEventListener('selection-changed', eventSpy)

    const firstRowCheckbox = component.shadowRoot.querySelector('tbody tr input[type="checkbox"]')
    expect(firstRowCheckbox.checked).toBe(false)

    // Click to select
    firstRowCheckbox.click()
    await component.updateComplete

    expect(firstRowCheckbox.checked).toBe(true)
    expect(component.selectedEmployees.has(1)).toBe(true)
    expect(eventSpy).toHaveBeenCalled()
    expect(eventSpy.mock.calls[0][0].detail.selectedIds).toContain(1)
  })

  it('should handle master checkbox functionality', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const eventSpy = vi.fn()
    component.addEventListener('selection-changed', eventSpy)

    const masterCheckbox = component.shadowRoot.querySelector('thead input[type="checkbox"]')
    expect(masterCheckbox.checked).toBe(false)

    // Click master checkbox to select all
    masterCheckbox.click()
    await component.updateComplete

    expect(masterCheckbox.checked).toBe(true)
    expect(component.selectedEmployees.size).toBe(3)
    expect(component.selectedEmployees.has(1)).toBe(true)
    expect(component.selectedEmployees.has(2)).toBe(true)
    expect(component.selectedEmployees.has(3)).toBe(true)

    const allRowCheckboxes = component.shadowRoot.querySelectorAll('tbody input[type="checkbox"]')
    allRowCheckboxes.forEach(checkbox => {
      expect(checkbox.checked).toBe(true)
    })

    expect(eventSpy).toHaveBeenCalled()
  })

  it('should unselect all when master checkbox is unchecked', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const masterCheckbox = component.shadowRoot.querySelector('thead input[type="checkbox"]')
    
    // First select all
    masterCheckbox.click()
    await component.updateComplete
    expect(component.selectedEmployees.size).toBe(3)

    // Then unselect all
    masterCheckbox.click()
    await component.updateComplete

    expect(masterCheckbox.checked).toBe(false)
    expect(component.selectedEmployees.size).toBe(0)

    const allRowCheckboxes = component.shadowRoot.querySelectorAll('tbody input[type="checkbox"]')
    allRowCheckboxes.forEach(checkbox => {
      expect(checkbox.checked).toBe(false)
    })
  })

  it('should update master checkbox when all rows are individually selected', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const masterCheckbox = component.shadowRoot.querySelector('thead input[type="checkbox"]')
    const allRowCheckboxes = component.shadowRoot.querySelectorAll('tbody input[type="checkbox"]')

    expect(masterCheckbox.checked).toBe(false)

    // Select all rows individually
    allRowCheckboxes.forEach(checkbox => checkbox.click())
    await component.updateComplete

    expect(masterCheckbox.checked).toBe(true)
    expect(component.selectedEmployees.size).toBe(3)
  })

  it('should navigate to edit page when edit button is clicked', async () => {
    const { Router } = await import('@vaadin/router')
    
    const template = html`<table-view .employees=${[mockEmployees[0]]}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const editButton = component.shadowRoot.querySelector('tbody tr td:last-child button:first-child')
    editButton.click()

    expect(Router.go).toHaveBeenCalledWith('/edit/1')
  })

  it('should dispatch delete-employee event when delete button is clicked', async () => {
    const template = html`<table-view .employees=${[mockEmployees[0]]}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const eventSpy = vi.fn()
    component.addEventListener('delete-employee', eventSpy)

    const deleteButton = component.shadowRoot.querySelector('tbody tr td:last-child button:last-child')
    deleteButton.click()

    expect(eventSpy).toHaveBeenCalledOnce()
    expect(eventSpy.mock.calls[0][0].detail).toEqual({ id: 1 })
  })

  it('should have edit and delete buttons in each row', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const actionCells = component.shadowRoot.querySelectorAll('tbody tr td:last-child')
    expect(actionCells.length).toBe(3)

    actionCells.forEach(cell => {
      const buttons = cell.querySelectorAll('button')
      expect(buttons.length).toBe(2)

      const editIcon = buttons[0].querySelector('img')
      const deleteIcon = buttons[1].querySelector('img')

      expect(editIcon).toBeTruthy()
      expect(deleteIcon).toBeTruthy()
      expect(editIcon.alt).toBe('Edit')
      expect(deleteIcon.alt).toBe('Delete')
    })
  })

  it('should apply selected class to selected rows', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const firstRow = component.shadowRoot.querySelector('tbody tr')
    const firstRowCheckbox = firstRow.querySelector('input[type="checkbox"]')

    expect(firstRow.className).not.toContain('selected')

    firstRowCheckbox.click()
    await component.updateComplete

    expect(firstRow.className).toContain('selected')
  })

  it('should properly manage selection state with updateSelected method', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const eventSpy = vi.fn()
    component.addEventListener('selection-changed', eventSpy)

    // Test selecting
    component.updateSelected(1, true)
    expect(component.selectedEmployees.has(1)).toBe(true)
    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { selectedIds: [1] }
      })
    )

    // Test deselecting
    component.updateSelected(1, false)
    expect(component.selectedEmployees.has(1)).toBe(false)
  })

  it('should handle deleteEmployee method correctly', async () => {
    const template = html`<table-view .employees=${[mockEmployees[0]]}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const eventSpy = vi.fn()
    component.addEventListener('delete-employee', eventSpy)

    component.deleteEmployee(1)

    expect(eventSpy).toHaveBeenCalledOnce()
    expect(eventSpy.mock.calls[0][0].detail).toEqual({ id: 1 })
    expect(eventSpy.mock.calls[0][0].bubbles).toBe(true)
    expect(eventSpy.mock.calls[0][0].composed).toBe(true)
  })

  it('should maintain selection state across re-renders', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    // Select first employee
    const firstRowCheckbox = component.shadowRoot.querySelector('tbody tr input[type="checkbox"]')
    firstRowCheckbox.click()
    await component.updateComplete

    expect(component.selectedEmployees.has(1)).toBe(true)

    // Force re-render
    component.requestUpdate()
    await component.updateComplete

    // Selection should be maintained
    expect(component.selectedEmployees.has(1)).toBe(true)
    const updatedFirstRowCheckbox = component.shadowRoot.querySelector('tbody tr input[type="checkbox"]')
    expect(updatedFirstRowCheckbox.checked).toBe(true)
  })

  it('should handle partial selection state correctly', async () => {
    const template = html`<table-view .employees=${mockEmployees}></table-view>`
    render(template, container)

    const component = container.querySelector('table-view')
    await component.updateComplete

    const masterCheckbox = component.shadowRoot.querySelector('thead input[type="checkbox"]')
    const firstRowCheckbox = component.shadowRoot.querySelector('tbody tr input[type="checkbox"]')

    // Select only one employee
    firstRowCheckbox.click()
    await component.updateComplete

    // Master checkbox should not be checked when only some employees are selected
    expect(masterCheckbox.checked).toBe(false)
    expect(component.selectedEmployees.size).toBe(1)
  })
})
