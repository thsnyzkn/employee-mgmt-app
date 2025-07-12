import { html, LitElement, css } from "lit";
import "./card-property";
import { propertyTypes } from "../../utils/constants";

class ListView extends LitElement {
  static properties = {
    employees: { type: Array },
  };
  static styles = css`
    ol {
      display: flex;
      gap: 1rem;
      padding: 0;
      list-style: none;
    }
    li {
      border: 1px solid red;
    }
  `;
  render() {
    let index = 0;
    return html`
      <ol>
          ${this.employees?.map(
            (employee) => html`
              <li>
                <card-property
                  .title=${employee.firstName}
                  .label=${propertyTypes[index++]}
                ></card-property>
                <card-property
                  .title=${employee.lastName}
                  .label=${propertyTypes[index++]}
                ></card-property>
                <card-property
                  .title=${employee.dateOfEmployment}
                  .label=${propertyTypes[index++]}
                ></card-property>
                <card-property
                  .title=${employee.dateOfBirth}
                  .label=${propertyTypes[index++]}
                ></card-property>
                <card-property
                  .title=${employee.phone}
                  .label=${propertyTypes[index++]}
                ></card-property>
                <card-property
                  .title=${employee.email}
                  .label=${propertyTypes[index++]}
                ></card-property>
                <card-property
                  .title=${employee.department}
                  .label=${propertyTypes[index++]}
                ></card-property>
                <card-property
                  .title=${employee.position}
                  .label=${propertyTypes[index++]}
                ></card-property>
              </li>
            `
          )}
        </li>
      </ol>
    `;
  }
  index = 0;
}

customElements.define("list-view", ListView);
