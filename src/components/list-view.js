import { html, LitElement, css } from "lit";
import "./card-property";
import { propertyTypes } from "../../utils/constants";

class ListView extends LitElement {
  static properties = {
    employees: { type: Array },
  };
  static styles = css`
    ol {
      display: grid;
      grid-template-columns: repeat(2, minmax(480px, 1fr));
      justify-content: space-between;
      gap: 16px;
      padding: 0;
      margin: 0;
      list-style: none;
      margin: 0 auto;
    }
    li {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      justify-content: space-between;
      gap: 24px;
      padding: 16px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s, transform 0.2s;
    }
    li:hover {
      box-shadow: 0 8px 16px -2px rgba(0, 0, 0, 0.15);
      transform: translateY(-4px) scale(1.02);
    }
    li > *:nth-child(2n) {
      justify-self: flex;
      text-align: left;
    }
  `;

  getEmployeeValue(employee, propertyType) {
    switch (propertyType) {
      case "First Name":
        return employee.firstName;
      case "Last Name":
        return employee.lastName;
      case "Date of Employment":
        return employee.dateOfEmployment;
      case "Date of Birth":
        return employee.dateOfBirth;
      case "Phone":
        return employee.phone;
      case "Email":
        return employee.email;
      case "Department":
        return employee.department;
      case "Position":
        return employee.position;
      case "Actions":
        return html`<div>
          <button>Edit</button>
          <button>Delete</button>
        </div>`;

      default:
        return "N/A";
    }
  }
  render() {
    return html`
      <ol>
        ${this.employees?.map(
          (employee) => html`
            <li>
              ${propertyTypes.map(
                (property) => html`
                  <card-property
                    .title=${this.getEmployeeValue(employee, property)}
                    .label=${property}
                  ></card-property>
                `
              )}
            </li>
          `
        )}
      </ol>
    `;
  }
}

customElements.define("list-view", ListView);
