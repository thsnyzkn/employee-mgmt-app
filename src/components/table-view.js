import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";
import { propertyTypes } from "../../utils/constants";

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
    
    button svg {
      width: 18px;
      height: 18px;
      vertical-align: middle;
    }
    
    @media (min-width: 768px) {
      button svg {
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
                  <button class="primary" @click=${() => Router.go(`/edit/${employee.id}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                        <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/>
                        <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415zM16 5l3 3"/>
                      </g>
                    </svg>
                  </button>
                  <button class="secondary" @click=${() => this.deleteEmployee(employee.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <g fill="none" fill-rule="evenodd">
                        <path d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
                        <path fill="currentColor" d="M7.823 3.368A2 2 0 0 1 9.721 2h4.558a2 2 0 0 1 1.898 1.368L16.72 5H20a1 1 0 1 1 0 2h-1v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4a1 1 0 0 1 0-2h3.28l.543-1.632ZM9.387 5l.334-1h4.558l.334 1H9.387Z"/>
                      </g>
                    </svg>
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
