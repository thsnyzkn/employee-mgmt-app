import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";

class EmployeeList extends LitElement {
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
  };

  constructor() {
    super();
    this.employees = [
      {
        id: 1,
        firstName: "Tahsin",
        lastName: "Yazkan",
        dateOfEmployment: "23/09/2022",
        dateOfBirth: "02/02/1991",
        phone: "+905354641232",
        email: "sezin@gmail.com",
        department: "Development",
        position: "Designer",
      },
      {
        id: 2,
        firstName: "Sezin",
        lastName: "Yazkan",
        dateOfEmployment: "23/09/2022",
        dateOfBirth: "02/02/1991",
        phone: "+905354641232",
        email: "sezin@gmail.com",
        department: "Development",
        position: "Designer",
      },
    ];
  }

  render() {
    return html` <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Date of Employment</th>
          <th>Date of Birth</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Department</th>
          <th>Position</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${this.employees.map(
          (employee) => html`
            <tr>
              <td>${employee.firstName}</td
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
    </table>`;
  }
}

customElements.define("employee-list", EmployeeList);
