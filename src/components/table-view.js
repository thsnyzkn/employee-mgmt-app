import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";
import { propertyTypes } from "../../utils/constants";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";

class TableView extends LitElement {
  static properties = {
    employees: { type: Array },
  };
  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
      padding: 16px;
      background-color: white;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    td:last-of-type {
      display: flex;
      gap: 8px;
    }
    th {
      background-color: white;
      color: #ff6200;
    }
    button {
      margin-right: 4px;
      padding: 8px;
      cursor: pointer;
      background: none;
      border: none;
    }
    button img {
      width: 24px;
      height: 24px;
      vertical-align: middle;
    }
  `;

  static properties = {
    employees: { type: Array },
    mode: { type: String },
  };

  constructor() {
    super();
    this.selectedEmployees = new Set();
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
            ${propertyTypes.map((property) => html`<th>${property}</th>`)}
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
                  <button @click=${() => Router.go(`/edit/${employee.id}`)}>
                    ${html`<img src="${editIcon}" alt="Edit" />`}
                  </button>
                  <button @click=${() => this.deleteEmployee(employee.id)}>
                    ${html`<img src="${deleteIcon}" alt="Delete" />`}
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
