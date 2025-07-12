import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";
import { propertyTypes } from "../../utils/constants";

class TableView extends LitElement {
  static properties = {
    employees: { type: Array },
  };
  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    button {
      margin-right: 5px;
      padding: 5px 10px;
      cursor: pointer;
    }
  `;

  static properties = {
    employees: { type: Array },
    mode: { type: String },
  };

  render() {
    return html`
      <table>
        <thead>
          <tr>
            ${propertyTypes.map((property) => html`<th>${property}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(
            (employee) => html`
              <tr>
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
                    Edit
                  </button>
                  <button @click=${() => this.deleteEmployee(employee.id)}>
                    Delete
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
