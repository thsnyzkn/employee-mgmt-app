import { html, LitElement } from "lit";

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    loading: { type: Boolean },
  };
  render() {
    return html` <div>LIST</div> `;
  }
}

customElements.define("employee-list", EmployeeList);
