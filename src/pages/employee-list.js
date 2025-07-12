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
    filteredEmployees: { type: Array },
    mode: { type: String },
    searchQuery: { type: String },
  };

  constructor() {
    super();
    this.filteredEmployees = [];
    this.searchQuery = "";
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

  toggleMode(param) {
    this.mode = param;
  }

  updateSearch(e) {
    this.searchQuery = e.target.value.toLowerCase();
    if (this.searchQuery)
      this.filteredEmployees = this.employees.filter((employee) =>
        ["firstName", "lastName", "department", "position"].some(
          (field) =>
            employee[field] &&
            employee[field].toLowerCase().includes(this.searchQuery)
        )
      );

    this.requestUpdate();
  }

  render() {
    const employeesToShow = this.searchQuery
      ? this.filteredEmployees
      : this.employees;

    return html`
      <section>
        <h2>Employee List</h2>
        <div class="search-container">
          <input
            class="search-input"
            type="text"
            .value=${this.searchQuery}
            @input=${this.updateSearch}
            placeholder="Search by name, department, or position..."
          />
        </div>
        <div id="button-wrapper">
          <button @click=${() => this.toggleMode("table")}>Table</button>
          <button @click=${() => this.toggleMode("list")}>List</button>
        </div>
      </section>
      <div>
        ${this.mode === "table"
          ? html`<table-view .employees=${employeesToShow}></table-view>`
          : html`<list-view .employees=${employeesToShow}></list-view>`}
      </div>
    `;
  }
}

customElements.define("employee-list", EmployeeList);
