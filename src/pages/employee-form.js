import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";
import { msg, str, updateWhenLocaleChanges } from "@lit/localize";
import { store, addEmployee, updateEmployee } from "../store";

class EmployeeForm extends LitElement {
  static properties = {
    employeeId: { type: Number },
    employee: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    .form-container {
      max-width: 100%;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      background-color: white;
    }

    @media (min-width: 768px) {
      .form-container {
        max-width: 800px;
        margin: 20px auto;
        padding: 32px;
      }
    }

    @media (min-width: 1024px) {
      .form-container {
        max-width: 1000px;
        margin: 32px auto;
        padding: 40px;
      }
    }

    h2 {
      margin: 0 0 24px 0;
      color: #333;
      font-size: 24px;
      text-align: center;
    }

    @media (min-width: 768px) {
      h2 {
        font-size: 28px;
        text-align: left;
        margin-bottom: 32px;
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    @media (min-width: 600px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
    }

    @media (min-width: 1024px) {
      .form-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 28px;
        margin-bottom: 32px;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    @media (min-width: 768px) {
      label {
        font-size: 15px;
        margin-bottom: 10px;
      }
    }

    input[type="text"],
    input[type="email"],
    input[type="date"],
    input[type="tel"],
    select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
      background-color: white;
    }

    @media (min-width: 768px) {
      input[type="text"],
      input[type="email"],
      input[type="date"],
      input[type="tel"],
      select {
        padding: 14px 18px;
        font-size: 16px;
      }
    }

    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="date"]:focus,
    input[type="tel"]:focus,
    select:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    select {
      cursor: pointer;
      appearance: none;
      background-image: url('data:image/svg+xml;utf8,<svg fill="%23666" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 20px;
      padding-right: 40px;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 24px;
    }

    @media (min-width: 600px) {
      .form-actions {
        flex-direction: row;
        justify-content: center;
        gap: 16px;
      }
    }

    @media (min-width: 768px) {
      .form-actions {
        justify-content: flex-end;
        margin-top: 32px;
      }
    }

    button {
      padding: 14px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.2s;
      min-height: 48px;
      flex: 1;
    }

    @media (min-width: 600px) {
      button {
        flex: 0 1 auto;
        min-width: 140px;
        padding: 12px 32px;
      }
    }

    @media (min-width: 768px) {
      button {
        min-width: 160px;
        padding: 14px 40px;
      }
    }

    button.submit {
      background-color: #ff6200;
      color: white;
    }

    button.submit:hover {
      background-color: #e55a00;
    }

    button.cancel {
      background-color: white;
      color: #ff6200;
      border: 1px solid #ff6200;
    }

    button.cancel:hover {
      background-color: #f8f9fa;
    }

    button:active {
      transform: translateY(0);
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
    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadEmployee();
  }

  _loadEmployee() {
    if (this.employeeId) {
      const state = store.getState();
      const foundEmployee = state.employees.find(
        (emp) => emp.id === this.employeeId
      );
      this.employee = foundEmployee ? { ...foundEmployee } : {};
    } else {
      // Reset to default empty state when no employeeId
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
  }

  updated(changedProperties) {
    if (changedProperties.has("employeeId")) {
      this._loadEmployee();
    }

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
        <h2>
          ${this.employeeId
            ? msg(
                str`Edit Employee: ${this.employee.firstName} ${this.employee.lastName}`
              )
            : msg("Add Employee")}
        </h2>
        <form @submit=${this._handleSubmit}>
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">${msg("First Name:")}</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                .value=${this.employee.firstName || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="lastName">${msg("Last Name:")}</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                .value=${this.employee.lastName || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="dateOfEmployment"
                >${msg("Date of Employment:")}</label
              >
              <input
                type="date"
                id="dateOfEmployment"
                name="dateOfEmployment"
                .value=${this.employee.dateOfEmployment || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="dateOfBirth">${msg("Date of Birth:")}</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                .value=${this.employee.dateOfBirth || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="phone">${msg("Phone:")}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                .value=${this.employee.phone || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="email">${msg("Email:")}</label>
              <input
                type="email"
                id="email"
                name="email"
                .value=${this.employee.email || ""}
                required
              />
            </div>
            <div class="form-group">
              <label for="department">${msg("Department:")}</label>
              <select
                id="department"
                name="department"
                .value=${this.employee.department || ""}
                required
              >
                <option
                  value=""
                  disabled
                  ?selected=${!this.employee.department}
                >
                  ${msg("Please Select")}
                </option>
                <option
                  value="Analytics"
                  ?selected=${this.employee.department === "Analytics"}
                >
                  ${msg("Analytics")}
                </option>
                <option
                  value="Tech"
                  ?selected=${this.employee.department === "Tech"}
                >
                  ${msg("Tech")}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="position">${msg("Position:")}</label>
              <select
                id="position"
                name="position"
                .value=${this.employee.position || ""}
                required
              >
                <option value="" disabled ?selected=${!this.employee.position}>
                  ${msg("Please Select")}
                </option>
                <option
                  value="Junior"
                  ?selected=${this.employee.position === "Junior"}
                >
                  ${msg("Junior")}
                </option>
                <option
                  value="Medior"
                  ?selected=${this.employee.position === "Medior"}
                >
                  ${msg("Medior")}
                </option>
                <option
                  value="Senior"
                  ?selected=${this.employee.position === "Senior"}
                >
                  ${msg("Senior")}
                </option>
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit">${msg("Save")}</button>
            <button type="button" class="cancel" @click=${this._handleCancel}>
              ${msg("Cancel")}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("employee-form", EmployeeForm);
