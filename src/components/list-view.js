import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";
import "./card-property";
import { propertyTypes } from "../../utils/constants";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";

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
    .actions-container {
      display: flex;
      gap: 8px;
      justify-content: flex-start;
      width: 100%;
    }
    .actions-container button {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f9f9f9;
      cursor: pointer;
      font-size: 14px;
    }
    .actions-container button:first-of-type {
      background-color: #4caf50;
      color: white;
      border-color: #4caf50;
    }
    .actions-container button:last-of-type {
      background-color: #f44336;
      color: white;
      border-color: #f44336;
    }
    .actions-container button img {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      filter: brightness(0) invert(1);
      color: #ff6200;
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
              ${propertyTypes
                .filter((property) => property !== "Actions")
                .map(
                  (property) => html`
                    <card-property
                      .title=${this.getEmployeeValue(employee, property)}
                      .label=${property}
                    ></card-property>
                  `
                )}
              <div class="actions-container">
                <button @click=${() => Router.go(`/edit/${employee.id}`)}>
                  ${html`<img src="${editIcon}" alt="Edit" />`} Edit
                </button>
                <button
                  @click=${() =>
                    this.dispatchEvent(
                      new CustomEvent("delete-employee", {
                        detail: { id: employee.id },
                        bubbles: true,
                        composed: true,
                      })
                    )}
                >
                  ${html`<img src="${deleteIcon}" alt="Delete" />`} Delete
                </button>
              </div>
            </li>
          `
        )}
      </ol>
    `;
  }
}

customElements.define("list-view", ListView);
