import { describe, it, expect, beforeEach, vi } from 'vitest'
import { html, render } from 'lit'
import '../employee-list.js'

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
          position: 'Developer'
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          department: 'Analytics',
          position: 'Analyst'
        }
      ]
    })),
    subscribe: vi.fn(() => vi.fn()), // Return unsubscribe function
    dispatch: vi.fn()
  },
  deleteSelectedEmployees: vi.fn(),
  deleteEmployee: vi.fn()
}))

// Mock the assets
vi.mock('../../assets/table.svg', () => ({ default: 'table-icon' }))
vi.mock('../../assets/list.svg', () => ({ default: 'list-icon' }))
vi.mock('../../assets/delete.svg', () => ({ default: 'delete-icon' }))
vi.mock('../../assets/previous.svg', () => ({ default: 'previous-icon' }))
vi.mock('../../assets/next.svg', () => ({ default: 'next-icon' }))

describe('EmployeeList Page', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    vi.clearAllMocks()
  })

  it('should render with default state', async () => {
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    expect(component).toBeTruthy()
    
    await component.updateComplete
    
    // Check title
    const title = component.shadowRoot.querySelector('h2')
    expect(title.textContent).toBe('Employee List')
    
    // Check search input
    const searchInput = component.shadowRoot.querySelector('.search-input')
    expect(searchInput).toBeTruthy()
    expect(searchInput.placeholder).toBe('Search by name, department, or position...')
  })

  it('should initialize with correct default properties', async () => {
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    await component.updateComplete
    
    expect(component.mode).toBe('list')
    expect(component.currentPage).toBe(1)
    expect(component.pageSize).toBe(4)
    expect(component.searchQuery).toBe('')
    expect(component.selectedEmployeeIds).toEqual([])
    expect(component.isModalVisible).toBe(false)
  })

  it('should toggle between list and table modes', async () => {
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    await component.updateComplete
    
    // Initially in list mode
    expect(component.mode).toBe('list')
    expect(component.pageSize).toBe(4)
    
    // Toggle to table mode
    component.toggleMode('table')
    await component.updateComplete
    
    expect(component.mode).toBe('table')
    expect(component.pageSize).toBe(9)
    expect(component.currentPage).toBe(1) // Should reset to page 1
    
    // Toggle back to list mode
    component.toggleMode('list')
    await component.updateComplete
    
    expect(component.mode).toBe('list')
    expect(component.pageSize).toBe(4)
  })

  it('should handle search functionality', async () => {
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    await component.updateComplete
    
    // Simulate search input
    const searchInput = component.shadowRoot.querySelector('.search-input')
    searchInput.value = 'John'
    searchInput.dispatchEvent(new Event('input'))
    
    await component.updateComplete
    
    expect(component.searchQuery).toBe('john') // Should be lowercase
    
    // Test filtered employees
    const filteredEmployees = component.filteredEmployees
    expect(filteredEmployees.length).toBe(1)
    expect(filteredEmployees[0].firstName).toBe('John')
  })

  it('should filter employees by multiple fields', async () => {
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    await component.updateComplete
    
    // Search by department
    component.searchQuery = 'tech'
    expect(component.filteredEmployees.length).toBe(1)
    expect(component.filteredEmployees[0].department).toBe('Tech')
    
    // Search by position
    component.searchQuery = 'analyst'
    expect(component.filteredEmployees.length).toBe(1)
    expect(component.filteredEmployees[0].position).toBe('Analyst')
    
    // Search that matches no results
    component.searchQuery = 'xyz'
    expect(component.filteredEmployees.length).toBe(0)
  })

  it('should handle pagination correctly', async () => {
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    await component.updateComplete
    
    // With 2 employees and pageSize 4, should have 1 page
    expect(component.totalPages).toBe(1)
    expect(component.currentPage).toBe(1)
    
    // Test goToPage method
    component.goToPage(2)
    expect(component.currentPage).toBe(1) // Should not change because totalPages = 1
    
    // Test with more employees (simulate)
    component.employees = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: 'Test',
      department: 'Tech',
      position: 'Developer'
    }))
    
    await component.updateComplete
    
    expect(component.totalPages).toBe(3) // 10 employees / 4 per page = 2.5 -> 3 pages
    
    component.goToPage(2)
    expect(component.currentPage).toBe(2)
    
    component.goToPage(0) // Invalid page
    expect(component.currentPage).toBe(2) // Should not change
    
    component.goToPage(4) // Invalid page
    expect(component.currentPage).toBe(2) // Should not change
  })

  it('should handle selection changes', async () => {
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    await component.updateComplete
    
    // Simulate selection change event
    const selectionEvent = new CustomEvent('selection-changed', {
      detail: { selectedIds: [1, 2] }
    })
    
    component.handleSelectionChanged(selectionEvent)
    
    expect(component.selectedEmployeeIds).toEqual([1, 2])
  })

  it('should show modal when deleting selected employees', async () => {
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    component.selectedEmployeeIds = [1, 2]
    await component.updateComplete
    
    // Call deleteSelected
    component.deleteSelected()
    
    expect(component.isModalVisible).toBe(true)
    expect(component.modalMessage).toBe('Are you sure you want to delete the selected employees?')
  })

  it('should show modal when deleting single employee', async () => {
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    await component.updateComplete
    
    // Call deleteSingleEmployee
    component.deleteSingleEmployee(1)
    
    expect(component.isModalVisible).toBe(true)
    expect(component.modalMessage).toBe('Are you sure you want to delete this employee?')
  })

  it('should handle modal confirm action for selected employees', async () => {
    const { store, deleteSelectedEmployees } = await import('../../store')
    
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    component.selectedEmployeeIds = [1, 2]
    await component.updateComplete
    
    component.deleteSelected()
    
    // Execute confirm action
    component.confirmAction()
    
    expect(deleteSelectedEmployees).toHaveBeenCalledWith([1, 2])
    expect(store.dispatch).toHaveBeenCalled()
    expect(component.selectedEmployeeIds).toEqual([])
    expect(component.isModalVisible).toBe(false)
  })

  it('should handle modal confirm action for single employee', async () => {
    const { store, deleteEmployee } = await import('../../store')
    
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    await component.updateComplete
    
    component.deleteSingleEmployee(1)
    
    // Execute confirm action
    component.confirmAction()
    
    expect(deleteEmployee).toHaveBeenCalledWith(1)
    expect(store.dispatch).toHaveBeenCalled()
    expect(component.isModalVisible).toBe(false)
  })

  it('should subscribe to store changes on connect', async () => {
    const { store } = await import('../../store')
    
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    await component.updateComplete
    
    expect(store.subscribe).toHaveBeenCalled()
  })

  it('should unsubscribe from store changes on disconnect', async () => {
    const mockUnsubscribe = vi.fn()
    const { store } = await import('../../store')
    store.subscribe.mockReturnValue(mockUnsubscribe)
    
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    await component.updateComplete
    
    // Disconnect the component
    component.disconnectedCallback()
    
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('should calculate paginated employees correctly', async () => {
    const template = html`<employee-list></employee-list>`
    render(template, container)
    
    const component = container.querySelector('employee-list')
    
    // Set up test data
    component.employees = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      firstName: `User${i + 1}`,
      lastName: 'Test',
      department: 'Tech',
      position: 'Developer'
    }))
    
    component.pageSize = 3
    component.currentPage = 1
    
    await component.updateComplete
    
    const paginatedEmployees = component.paginatedEmployees
    expect(paginatedEmployees.length).toBe(3)
    expect(paginatedEmployees[0].firstName).toBe('User1')
    expect(paginatedEmployees[2].firstName).toBe('User3')
    
    // Test second page
    component.currentPage = 2
    const secondPageEmployees = component.paginatedEmployees
    expect(secondPageEmployees.length).toBe(3)
    expect(secondPageEmployees[0].firstName).toBe('User4')
    expect(secondPageEmployees[2].firstName).toBe('User6')
  })
})
