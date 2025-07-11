import { LitElement, html } from "lit";

class EmployeeForm extends LitElement {
  static properties = {
    employees: { type: Array },
    loading: { type: Boolean },
  };
  render() {
    return html` <div>FORM</div> `;
  }
}

customElements.define("employee-form", EmployeeForm);
