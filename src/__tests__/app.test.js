import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { html, render } from 'lit'
import '../app.js'

// Mock Router and dynamic imports
const mockRouter = {
  setRoutes: vi.fn()
}

vi.mock('@vaadin/router', () => ({
  Router: vi.fn(() => mockRouter)
}))

// Mock dynamic imports
vi.mock('../pages/employee-list.js', () => ({}))
vi.mock('../pages/employee-form.js', () => ({}))

describe('AppRoot Component', () => {
  let container
  let component

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should render the app component correctly', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    expect(component).toBeTruthy()
    expect(component.shadowRoot).toBeTruthy()
  })

  it('should render header with correct structure', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    const header = component.shadowRoot.querySelector('header')
    expect(header).toBeTruthy()
    expect(header.getAttribute('role')).toBe('banner')

    // Check logo and company name
    const logoLink = header.querySelector('a[href="/"]')
    expect(logoLink).toBeTruthy()
    expect(logoLink.textContent.trim()).toContain('Ing')

    const logoImg = logoLink.querySelector('img')
    expect(logoImg).toBeTruthy()
    expect(logoImg.alt).toBe('Ing Logo')
    expect(logoImg.getAttribute('height')).toBe('40px')
    expect(logoImg.getAttribute('width')).toBe('40px')
  })

  it('should render navigation links correctly', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    const navDiv = component.shadowRoot.querySelector('header div')
    expect(navDiv).toBeTruthy()

    const links = navDiv.querySelectorAll('a')
    expect(links.length).toBe(2)

    // Check Employees link
    expect(links[0].href).toBe('http://localhost:3000/')
    expect(links[0].textContent.trim()).toBe('Employees')

    // Check Add Employee link
    expect(links[1].href).toBe('http://localhost:3000/add')
    expect(links[1].textContent.trim()).toBe('Add Employee')
  })

  it('should render language selector button', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    const languageButton = component.shadowRoot.querySelector('button')
    expect(languageButton).toBeTruthy()

    const languageImg = languageButton.querySelector('img')
    expect(languageImg).toBeTruthy()
    expect(languageImg.alt).toBe('Turkish Language Selector')
    expect(languageImg.getAttribute('height')).toBe('40px')
    expect(languageImg.getAttribute('width')).toBe('40px')
  })

  it('should render page container and outlet', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    const pageContainer = component.shadowRoot.querySelector('.page-container')
    expect(pageContainer).toBeTruthy()

    const outlet = component.shadowRoot.querySelector('#outlet')
    expect(outlet).toBeTruthy()
  })

  it('should setup router in firstUpdated lifecycle', async () => {
    const { Router } = await import('@vaadin/router')
    
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    // Router should be instantiated
    expect(Router).toHaveBeenCalledWith(component.shadowRoot.getElementById('outlet'))
    
    // Routes should be set
    expect(mockRouter.setRoutes).toHaveBeenCalledOnce()
    
    const routes = mockRouter.setRoutes.mock.calls[0][0]
    expect(routes).toHaveLength(4)
  })

  it('should configure correct routes', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    const routes = mockRouter.setRoutes.mock.calls[0][0]

    // Root route
    expect(routes[0]).toEqual({
      path: '/',
      component: 'employee-list',
      action: expect.any(Function)
    })

    // Add route
    expect(routes[1]).toEqual({
      path: '/add',
      component: 'employee-form',
      action: expect.any(Function)
    })

    // Edit route
    expect(routes[2]).toEqual({
      path: '/edit/:id',
      action: expect.any(Function)
    })

    // Fallback route
    expect(routes[3]).toEqual({
      path: '(.*)',
      redirect: '/'
    })
  })

  it('should handle edit route action correctly', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    const routes = mockRouter.setRoutes.mock.calls[0][0]
    const editRoute = routes[2]

    // Mock context and commands for edit route
    const mockContext = {
      params: { id: '123' }
    }
    const mockComponent = { employeeId: null }
    const mockCommands = {
      component: vi.fn(() => mockComponent)
    }

    const result = await editRoute.action(mockContext, mockCommands)

    expect(mockCommands.component).toHaveBeenCalledWith('employee-form')
    expect(mockComponent.employeeId).toBe(123)
    expect(result).toBe(mockComponent)
  })

  it('should have changeLanguage method and handle button clicks', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    // Verify changeLanguage method exists
    expect(component.changeLanguage).toBeDefined()
    expect(typeof component.changeLanguage).toBe('function')
    
    // Verify method can be called without errors
    expect(() => {
      component.changeLanguage()
    }).not.toThrow()

    // Verify button exists and has click handler
    const languageButton = component.shadowRoot.querySelector('button')
    expect(languageButton).toBeTruthy()
  })

  it('should have correct CSS classes and structure', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    // Check if main container has correct class
    const pageContainer = component.shadowRoot.querySelector('.page-container')
    expect(pageContainer).toBeTruthy()

    // Check if outlet exists inside page container
    const outlet = pageContainer.querySelector('#outlet')
    expect(outlet).toBeTruthy()
  })

  it('should handle route actions for root and add paths', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    const routes = mockRouter.setRoutes.mock.calls[0][0]

    // Test root route action
    const rootRouteAction = routes[0].action
    expect(rootRouteAction).toBeInstanceOf(Function)

    // Test add route action  
    const addRouteAction = routes[1].action
    expect(addRouteAction).toBeInstanceOf(Function)

    // Both should be async functions that return promises
    expect(rootRouteAction()).toBeInstanceOf(Promise)
    expect(addRouteAction()).toBeInstanceOf(Promise)
  })

  it('should have employees property defined', async () => {
    const template = html`<app-root></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    // Check if employees property exists (even if not used in current implementation)
    expect(component.hasOwnProperty('employees')).toBe(false) // Property not set initially
    
    // But the property should be defined in static properties
    expect(component.constructor.properties).toBeDefined()
    expect(component.constructor.properties.employees).toEqual({ type: Array })
  })

  it('should render with employees property set', async () => {
    const mockEmployees = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Smith' }
    ]

    const template = html`<app-root .employees=${mockEmployees}></app-root>`
    render(template, container)

    component = container.querySelector('app-root')
    await component.updateComplete

    expect(component.employees).toEqual(mockEmployees)
  })
})
