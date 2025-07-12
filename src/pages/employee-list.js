import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";
import "../components/table-view";
import "../components/list-view";

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
    mode: { type: String },
  };

  constructor() {
    super();
    this.mode = "table";
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

  _toggleMode(param) {
    this.mode = param;
  }

  render() {
    return html`
      <div>
        <h2>Employee List</h2>
        <button @click=${() => this._toggleMode("table")}>Table</button>
        <button @click=${() => this._toggleMode("list")}>List</button>
      </div>
      <button @click=${() => Router.go("/add")}>Add Employee</button>
      ${this.mode === "table"
        ? html`<table-view .employees=${this.employees}></table-view>`
        : html`<list-view .employees=${this.employees}></list-view>`}
    `;
  }
}

customElements.define("employee-list", EmployeeList);
