import { html, LitElement, css } from "lit";
import { store, deleteSelectedEmployees } from "../store";
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
    currentPage: { type: Number },
    pageSize: { type: Number },
  };

  constructor() {
    super();
    this.unsubscribe = null;
    this.searchQuery = "";
    this.mode = "list";
    this.employees = store.getState().employees;
    this.filteredEmployees = [...this.employees];
    this.currentPage = 1;
    this.pageSize = 4;
    this.selectedEmployeeIds = [];
  }

  handleSelectionChanged(e) {
    this.selectedEmployeeIds = e.detail.selectedIds;
    this.requestUpdate();
  }

  deleteSelected() {
    store.dispatch(deleteSelectedEmployees(this.selectedEmployeeIds));
    this.selectedEmployeeIds = [];
  }

  _applyFilter() {
    if (this.searchQuery) {
      this.filteredEmployees = this.employees.filter((employee) =>
        ["firstName", "lastName", "department", "position"].some(
          (field) =>
            employee[field] &&
            employee[field].toLowerCase().includes(this.searchQuery)
        )
      );
    } else {
      this.filteredEmployees = [...this.employees];
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => {
      this.employees = store.getState().employees;
      this._applyFilter();
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
    super.disconnectedCallback();
  }

  toggleMode(param) {
    this.mode = param;
    this.currentPage = 1;
    this.pageSize = param === "list" ? 4 : 9;
  }

  updateSearch(e) {
    this.searchQuery = e.target.value.toLowerCase();
    this._applyFilter();
    this.requestUpdate();
  }
  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.pageSize);
  }
  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEmployees.slice(start, end);
  }

  render() {
    const employeesToShow = this.searchQuery
      ? this.paginatedEmployees
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
          <button
            @click=${this.deleteSelected}
            ?disabled=${this.selectedEmployeeIds.length === 0}
          >
            Delete Selected
          </button>
          <button @click=${() => this.toggleMode("table")}>Table</button>
          <button @click=${() => this.toggleMode("list")}>List</button>
        </div>
      </section>
      <div>
        ${this.mode === "table"
          ? html`<table-view
              .employees=${this.paginatedEmployees}
              @selection-changed=${this.handleSelectionChanged}
            ></table-view>`
          : html`<list-view .employees=${this.paginatedEmployees}></list-view>`}
      </div>
      <div class="pagination-container">
        <button
          class="pagination-button"
          @click=${() => this.goToPage(this.currentPage - 1)}
          ?disabled=${this.currentPage === 1}
        >
          Previous
        </button>
        <span class="pagination-info"
          >Page ${this.currentPage} of ${this.totalPages}</span
        >
        <button
          class="pagination-button"
          @click=${() => this.goToPage(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages}
        >
          Next
        </button>
      </div>
    `;
  }
}

customElements.define("employee-list", EmployeeList);
