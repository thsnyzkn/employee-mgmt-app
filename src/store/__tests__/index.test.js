import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  addEmployee, 
  updateEmployee, 
  deleteEmployee, 
  deleteSelectedEmployees,
  store 
} from '../index.js'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

describe('Employee Store', () => {
  beforeEach(() => {
    // Reset localStorage mock
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    vi.clearAllMocks()
  })

  describe('addEmployee action', () => {
    it('should add a new employee with auto-generated ID', () => {
      const initialState = store.getState().employees
      const initialCount = initialState.length
      
      const newEmployee = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        department: 'Tech',
        position: 'Developer'
      }
      
      store.dispatch(addEmployee(newEmployee))
      
      const newState = store.getState().employees
      expect(newState.length).toBe(initialCount + 1)
      
      const addedEmployee = newState[newState.length - 1]
      expect(addedEmployee.firstName).toBe('John')
      expect(addedEmployee.lastName).toBe('Doe')
      expect(addedEmployee.id).toBeDefined()
      expect(addedEmployee.id).toBeGreaterThan(0)
    })

    it('should generate unique IDs for multiple employees', () => {
      const employee1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }
      
      const employee2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com'
      }
      
      store.dispatch(addEmployee(employee1))
      const stateAfterFirst = store.getState().employees
      const firstId = stateAfterFirst[stateAfterFirst.length - 1].id
      
      store.dispatch(addEmployee(employee2))
      const stateAfterSecond = store.getState().employees
      const secondId = stateAfterSecond[stateAfterSecond.length - 1].id
      
      expect(secondId).toBeGreaterThan(firstId)
    })
  })

  describe('updateEmployee action', () => {
    it('should update an existing employee', () => {
      const initialState = store.getState().employees
      const employeeToUpdate = initialState[0]
      
      const updatedEmployee = {
        ...employeeToUpdate,
        firstName: 'Updated',
        lastName: 'Name'
      }
      
      store.dispatch(updateEmployee(updatedEmployee))
      
      const newState = store.getState().employees
      const updatedEmployeeInState = newState.find(emp => emp.id === employeeToUpdate.id)
      
      expect(updatedEmployeeInState.firstName).toBe('Updated')
      expect(updatedEmployeeInState.lastName).toBe('Name')
      expect(updatedEmployeeInState.id).toBe(employeeToUpdate.id)
    })

    it('should not affect other employees when updating one', () => {
      const initialState = store.getState().employees
      const employeeToUpdate = initialState[0]
      const otherEmployee = initialState[1]
      
      const updatedEmployee = {
        ...employeeToUpdate,
        firstName: 'Updated'
      }
      
      store.dispatch(updateEmployee(updatedEmployee))
      
      const newState = store.getState().employees
      const otherEmployeeInState = newState.find(emp => emp.id === otherEmployee.id)
      
      expect(otherEmployeeInState).toEqual(otherEmployee)
    })
  })

  describe('deleteEmployee action', () => {
    it('should delete an employee by ID', () => {
      const initialState = store.getState().employees
      const initialCount = initialState.length
      const employeeToDelete = initialState[0]
      
      store.dispatch(deleteEmployee(employeeToDelete.id))
      
      const newState = store.getState().employees
      expect(newState.length).toBe(initialCount - 1)
      
      const deletedEmployee = newState.find(emp => emp.id === employeeToDelete.id)
      expect(deletedEmployee).toBeUndefined()
    })

    it('should not affect other employees when deleting one', () => {
      const initialState = store.getState().employees
      const employeeToDelete = initialState[0]
      const employeeToKeep = initialState[1]
      
      store.dispatch(deleteEmployee(employeeToDelete.id))
      
      const newState = store.getState().employees
      const keptEmployee = newState.find(emp => emp.id === employeeToKeep.id)
      
      expect(keptEmployee).toEqual(employeeToKeep)
    })
  })

  describe('deleteSelectedEmployees action', () => {
    it('should delete multiple employees by IDs', () => {
      const initialState = store.getState().employees
      const initialCount = initialState.length
      const idsToDelete = [initialState[0].id, initialState[1].id]
      
      store.dispatch(deleteSelectedEmployees(idsToDelete))
      
      const newState = store.getState().employees
      expect(newState.length).toBe(initialCount - 2)
      
      idsToDelete.forEach(id => {
        const deletedEmployee = newState.find(emp => emp.id === id)
        expect(deletedEmployee).toBeUndefined()
      })
    })

    it('should keep employees not in the deletion list', () => {
      const initialState = store.getState().employees
      const employeeToKeep = initialState[2]
      const idsToDelete = [initialState[0].id, initialState[1].id]
      
      store.dispatch(deleteSelectedEmployees(idsToDelete))
      
      const newState = store.getState().employees
      const keptEmployee = newState.find(emp => emp.id === employeeToKeep.id)
      
      expect(keptEmployee).toEqual(employeeToKeep)
    })
  })

  describe('localStorage integration', () => {
    it('should save state to localStorage when adding employee', () => {
      const newEmployee = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      }
      
      store.dispatch(addEmployee(newEmployee))
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'appState',
        expect.stringContaining('Test')
      )
    })

    it('should save state to localStorage when updating employee', () => {
      const initialState = store.getState().employees
      const employeeToUpdate = initialState[0]
      
      const updatedEmployee = {
        ...employeeToUpdate,
        firstName: 'Updated'
      }
      
      store.dispatch(updateEmployee(updatedEmployee))
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'appState',
        expect.stringContaining('Updated')
      )
    })

    it('should save state to localStorage when deleting employee', () => {
      const initialState = store.getState().employees
      const employeeToDelete = initialState[0]
      
      store.dispatch(deleteEmployee(employeeToDelete.id))
      
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })
})
