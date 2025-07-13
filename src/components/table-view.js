import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { propertyTypes } from "../../utils/constants";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";

class TableView extends LitElement {
  static properties = {
    employees: { type: Array },
  };
  static styles = css`
    :host {
      display: block;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    table {
      width: 100%;
      min-width: 800px; /* Minimum width to prevent cramping */
      border-collapse: collapse;
      background-color: white;
      border-radius: 8px;
      margin-bottom: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      table {
        min-width: 1000px;
        font-size: 14px;
      }
    }

    th,
    td {
      border: 1px solid #e0e0e0;
      padding: 12px 8px;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (min-width: 768px) {
      th,
      td {
        padding: 12px 16px;
      }
    }

    th {
      background-color: #f8f9fa;
      color: #ff6200;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    tr:nth-child(even) {
      background-color: #f8f9fa;
    }

    tr:hover {
      background-color: #e8f4f8;
    }

    td:first-of-type {
      position: sticky;
      left: 0;
      background-color: inherit;
      z-index: 5;
      border-right: 2px solid #ddd;
    }

    th:first-of-type {
      position: sticky;
      left: 0;
      z-index: 15;
      border-right: 2px solid #ddd;
    }

    td:last-of-type {
      display: flex;
      gap: 4px;
      justify-content: center;
      align-items: center;
      min-width: 100px;
    }

    @media (min-width: 768px) {
      td:last-of-type {
        gap: 8px;
        min-width: 120px;
      }
    }

    button {
      padding: 6px;
      cursor: pointer;
      border: 1px solid #ff6200;
      border-radius: 4px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    button.primary {
      background-color: #ff6200;
      color: white;
    }
    
    button.primary:hover {
      background-color: #e55a00;
    }
    
    button.secondary {
      background-color: white;
      color: #ff6200;
    }
    
    button.secondary:hover {
      background-color: #f8f9fa;
    }

    @media (min-width: 768px) {
      button {
        padding: 8px;
      }
    }
    
    button img {
      width: 18px;
      height: 18px;
      vertical-align: middle;
    }
    
    @media (min-width: 768px) {
      button img {
        width: 20px;
        height: 20px;
      }
    }

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    @media (min-width: 768px) {
      input[type="checkbox"] {
        width: 18px;
        height: 18px;
      }
    }
  `;

  static properties = {
    employees: { type: Array },
    mode: { type: String },
  };

  constructor() {
    super();
    this.selectedEmployees = new Set();
    updateWhenLocaleChanges(this);
  }

  handleMasterCheckboxChange(e) {
    const isChecked = e.target.checked;
    this.employees.forEach((employee) => {
      this.updateSelected(employee.id, isChecked);
    });
    this.requestUpdate();
  }

  handleRowCheckboxChange(employeeId, e) {
    this.updateSelected(employeeId, e.target.checked);
    this.requestUpdate();
  }

  updateSelected(employeeId, isSelected) {
    if (isSelected) {
      this.selectedEmployees.add(employeeId);
    } else {
      this.selectedEmployees.delete(employeeId);
    }
    this.dispatchEvent(
      new CustomEvent("selection-changed", {
        detail: { selectedIds: [...this.selectedEmployees] },
        bubbles: true,
        composed: true,
      })
    );
  }

  deleteEmployee(employeeId) {
    this.dispatchEvent(
      new CustomEvent("delete-employee", {
        detail: { id: employeeId },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const areAllSelected =
      this.employees.length > 0 &&
      this.employees.every((e) => this.selectedEmployees.has(e.id));
    return html`
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                .checked=${areAllSelected}
                @change=${this.handleMasterCheckboxChange}
              />
            </th>
            ${propertyTypes.map((property) => html`<th>${msg(property)}</th>`) }
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(
            (employee) => html`
              <tr
                class=${this.selectedEmployees.has(employee.id)
                  ? "selected"
                  : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    .checked=${this.selectedEmployees.has(employee.id)}
                    @change=${(e) =>
                      this.handleRowCheckboxChange(employee.id, e)}
                  />
                </td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.dateOfEmployment}</td>
                <td>${employee.dateOfBirth}</td>
                <td>${employee.phone}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td>
                  <button class="primary" @click=${() => Router.go(`/edit/${employee.id}`)}>
                    <img src=${editIcon} alt="Edit" />
                  </button>
                  <button class="secondary" @click=${() => this.deleteEmployee(employee.id)}>
                    <img src=${deleteIcon} alt="Delete" />
                  </button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
}

customElements.define("table-view", TableView);
