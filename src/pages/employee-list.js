import { html, LitElement, css } from "lit";
import { Router } from "@vaadin/router";
import "../components/table-view";
import "../components/list-view";

class EmployeeList extends LitElement {
  static styles = css`
    section {
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    button {
      padding: 4px 8px;
      cursor: pointer;
    }
    #button-wrapper {
      padding: 0;
      margin: 0;
    }
  `;

  static properties = {
    employees: { type: Array },
    mode: { type: String },
  };

  constructor() {
    super();
    this.mode = "list";
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
      <section>
        <h2>Employee List</h2>
        <div id="button-wrapper">
          <button @click=${() => this._toggleMode("table")}>Table</button>
          <button @click=${() => this._toggleMode("list")}>List</button>
        </div>
      </section>
      <div>
        ${this.mode === "table"
          ? html`<table-view .employees=${this.employees}></table-view>`
          : html`<list-view .employees=${this.employees}></list-view>`}
      </div>
    `;
  }
}

customElements.define("employee-list", EmployeeList);
