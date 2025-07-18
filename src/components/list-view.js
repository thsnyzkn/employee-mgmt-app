import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import "./card-property";
import { propertyTypesOriginal, getTranslatedPropertyType } from "../../utils/constants";
import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";

class ListView extends LitElement {
  static properties = {
    employees: { type: Array },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }
  static styles = css`
    :host {
      display: block;
    }

    ol {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    @media (min-width: 768px) {
      ol {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
      }
    }

    @media (min-width: 1200px) {
      ol {
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
        gap: 24px;
      }
    }

    li {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 16px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 1px solid #e0e0e0;
    }

    @media (min-width: 480px) {
      li {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        padding: 20px;
      }
    }

    @media (min-width: 768px) {
      li {
        gap: 20px;
        padding: 24px;
      }
    }

    li:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
      border-color: #ff6200;
    }

    @media (min-width: 480px) {
      li > *:nth-child(2n) {
        justify-self: flex-start;
        text-align: left;
      }
    }

    .actions-container {
      display: flex;
      gap: 8px;
      justify-content: center;
      width: 100%;
      margin-top: 8px;
      flex-wrap: wrap;
    }

    @media (min-width: 480px) {
      .actions-container {
        justify-content: flex-start;
        margin-top: 12px;
        flex-wrap: nowrap;
      }
    }

    .actions-container button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      color: white;
    }

    @media (min-width: 480px) {
      .actions-container button {
        flex: 0 1 auto;
        padding: 8px 16px;
      }
    }

    @media (min-width: 768px) {
      .actions-container button {
        padding: 10px 20px;
        font-size: 15px;
      }
    }

    .actions-container button:first-of-type {
      background-color: #ff6200;
      border-color: #ff6200;
    }

    .actions-container button:last-of-type {
      background-color: #172b53;
      border-color: #172b53;
    }

    .actions-container button img {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      flex-shrink: 0;
    }

    .actions-container button img {
      filter: brightness(0) invert(1);
    }

    @media (min-width: 768px) {
      .actions-container button img {
        width: 18px;
        height: 18px;
      }
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
              ${propertyTypesOriginal
                .filter((property) => property !== "Actions")
                .map(
                  (property) => html`
                    <card-property
                      .title=${this.getEmployeeValue(employee, property)}
                      .label=${getTranslatedPropertyType(property)}
                    ></card-property>
                  `
                )}
              <div class="actions-container">
                <button @click=${() => Router.go(`/edit/${employee.id}`)}>
                  ${html`<img src="${editIcon}" alt="Edit" />`} ${msg("Edit")}
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
                  ${html`<img src="${deleteIcon}" alt="Delete" />`}
                  ${msg("Delete")}
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
