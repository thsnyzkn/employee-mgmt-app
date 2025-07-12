import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";
import { store, addEmployee, updateEmployee } from "../store";

class EmployeeForm extends LitElement {
  static properties = {
    employeeId: { type: Number },
    employee: { type: Object },
  };

  static styles = css`
    .form-container {
      padding: 32px;
      margin: 32px auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .form-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding: 8px;
      justify-content: flex-start;
    }
    .form-group {
      margin-bottom: 0;
      flex: 1 1 100%;
    }

    @media (min-width: 768px) {
      .form-group {
        flex: 1 1 calc(50% - 8px);
      }
    }

    @media (min-width: 992px) {
      .form-group {
        flex: 0 0 calc(33.33% - 10.67px);
      }
    }
    label {
      display: block;
      margin-bottom: 4px;
      font-weight: bold;
    }
    input[type="text"],
    input[type="email"],
    input[type="date"],
    input[type="tel"],
    select {
      width: calc(100% - 16px);
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    select {
      width: calc(100% + 2px);
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-right: 8px;
      margin-top: 8px;
    }
    button {
      padding: 8px 32px;
      appearance: none;
      min-width: 320px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    button.submit {
      background-color: #4caf50;
      color: white;
    }
    button.cancel {
      background-color: #f44336;
      color: white;
    }
  `;

  constructor() {
    super();
    this.employee = {
      firstName: "",
      lastName: "",
      dateOfEmployment: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      department: "",
      position: "",
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.employeeId) {
      const state = store.getState();
      const foundEmployee = state.employees.find(
        (emp) => emp.id === this.employeeId
      );
      this.employee = foundEmployee ? { ...foundEmployee } : {}; // Create a new object reference
    }
  }

  updated(changedProperties) {
    if (
      changedProperties.has("employee") ||
      changedProperties.has("employeeId")
    ) {
      if (
        this.employeeId &&
        this.employee &&
        this.employee.firstName &&
        this.employee.lastName
      ) {
        document.title = `You are editing ${this.employee.firstName} ${this.employee.lastName}`;
      } else {
        document.title = "Add Employee";
      }
    }
  }

  _handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newEmployee = {};
    for (let [key, value] of formData.entries()) {
      newEmployee[key] = value;
    }

    if (this.employeeId) {
      store.dispatch(updateEmployee({ ...newEmployee, id: this.employeeId }));
    } else {
      store.dispatch(addEmployee({ ...newEmployee, id: Date.now() }));
    }
    Router.go("/");
  }

  _handleCancel() {
    Router.go("/");
  }

  render() {
    return html`
      <div class="form-container">
        <h2>${this.employeeId ? "Edit Employee" : "Add Employee"}</h2>
        <form @submit=${this._handleSubmit}>
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                .value=${this.employee.firstName || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                .value=${this.employee.lastName || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="dateOfEmployment">Date of Employment:</label>
              <input
                type="date"
                id="dateOfEmployment"
                name="dateOfEmployment"
                .value=${this.employee.dateOfEmployment || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="dateOfBirth">Date of Birth:</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                .value=${this.employee.dateOfBirth || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                .value=${this.employee.phone || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                .value=${this.employee.email || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="department">Department:</label>
              <select
                id="department"
                name="department"
                .value=${this.employee.department || ""}
                required
              >
                <option value="" disabled selected>Please Select</option>
                <option value="Analytics">Analytics</option>
                <option value="Tech">Tech</option>
              </select>
            </div>
            <div class="form-group">
              <label for="position">Position:</label>
              <select
                id="position"
                name="position"
                .value=${this.employee.position || ""}
                required
              >
                <option value="" disabled selected>Please Select</option>
                <option value="Junior">Junior</option>
                <option value="Medior">Medior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit">Save</button>
            <button type="button" class="cancel" @click=${this._handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("employee-form", EmployeeForm);
