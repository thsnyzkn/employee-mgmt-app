import { html, LitElement, css } from "lit";
import { store, deleteSelectedEmployees, deleteEmployee } from "../store";
import "../components/table-view";
import "../components/list-view";
import "../components/confirm-modal.js";
import tableIcon from "../assets/table.svg";
import listIcon from "../assets/list.svg";
import deleteIcon from "../assets/delete.svg";
import arrowLeftIcon from "../assets/previous.svg";
import arrowRightIcon from "../assets/next.svg";

class EmployeeList extends LitElement {
  static styles = css`
    section {
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .search-container {
      margin-bottom: 16px;
      margin-right: 16px;
    }
    .search-input {
      width: 100%;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 16px;
    }
    .search-input:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }
    .button-wrapper {
      display: flex;
      gap: 8px;
      background-color: transparent;
    }
    .pagination-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }
    .pagination-button {
      padding: 8px;
      border: none;
      background-color: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pagination-button:not(:has(img)) {
      border: 1px solid #ccc;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      padding: 0;
      background-color: #f9f9f9;
    }
    .pagination-button.active {
      background-color: #ff6200;
      color: white;
      border-color: #ff6200;
    }
    .pagination-button.active:not(:has(img)) {
      color: white;
    }
    .pagination-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .pagination-info {
      font-size: 16px;
      font-weight: bold;
    }
    button {
      all: unset;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      background-color: transparent;
      border: none;
      padding: 4px 8px;
    }
    button img {
      width: 16px;
      height: 16px;
    }
  `;

  static properties = {
    employees: { type: Array },
    mode: { type: String },
    searchQuery: { type: String },
    currentPage: { type: Number },
    pageSize: { type: Number },
    isModalVisible: { type: Boolean },
    modalMessage: { type: String },
    confirmAction: { type: Object },
    selectedEmployeeIds: { type: Array },
  };

  constructor() {
    super();
    this.unsubscribe = null;
    this.searchQuery = "";
    this.mode = "list";
    this.employees = store.getState().employees;
    this.currentPage = 1;
    this.pageSize = 4;
    this.selectedEmployeeIds = [];
    this.isModalVisible = false;
    this.modalMessage = "";
    this.confirmAction = () => {};
  }

  handleSelectionChanged(e) {
    this.selectedEmployeeIds = e.detail.selectedIds;
  }

  deleteSelected() {
    this.modalMessage =
      "Are you sure you want to delete the selected employees?";
    this.confirmAction = () => {
      store.dispatch(deleteSelectedEmployees(this.selectedEmployeeIds));
      this.selectedEmployeeIds = [];
      this.isModalVisible = false;
    };
    this.isModalVisible = true;
  }

  deleteSingleEmployee(employeeId) {
    this.modalMessage = "Are you sure you want to delete this employee?";
    this.confirmAction = () => {
      store.dispatch(deleteEmployee(employeeId));
      this.isModalVisible = false;
    };
    this.isModalVisible = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => {
      this.employees = store.getState().employees;
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
  }

  get filteredEmployees() {
    if (this.searchQuery) {
      return this.employees.filter((employee) =>
        ["firstName", "lastName", "department", "position"].some(
          (field) =>
            employee[field] &&
            employee[field].toLowerCase().includes(this.searchQuery)
        )
      );
    } else {
      return this.employees;
    }
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
      ${this.isModalVisible
        ? html`
            <confirm-modal
              .message=${this.modalMessage}
              .onConfirm=${this.confirmAction}
              .onCancel=${() => (this.isModalVisible = false)}
            ></confirm-modal>
          `
        : ""}
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
        <div class="button-wrapper">
          ${this.mode === "table"
            ? html` <button
                @click=${this.deleteSelected}
                ?disabled=${this.selectedEmployeeIds.length === 0}
                title="Delete Selected"
              >
                ${html`<img src="${deleteIcon}" alt="Delete Selected" />`}
              </button>`
            : null}

          <button @click=${() => this.toggleMode("table")}>
            ${html`<img src="${tableIcon}" alt="Table View" />`}
          </button>
          <button @click=${() => this.toggleMode("list")}>
            ${html`<img src="${listIcon}" alt="List View" />`}
          </button>
        </div>
      </section>
      <div>
        ${this.mode === "table"
          ? html`<table-view
              .employees=${this.paginatedEmployees}
              @selection-changed=${this.handleSelectionChanged}
              @delete-employee=${(e) => this.deleteSingleEmployee(e.detail.id)}
            ></table-view>`
          : html`<list-view
              .employees=${this.paginatedEmployees}
              @delete-employee=${(e) => this.deleteSingleEmployee(e.detail.id)}
            ></list-view>`}
      </div>
      <div class="pagination-container">
        <button
          class="pagination-button"
          @click=${() => this.goToPage(this.currentPage - 1)}
          ?disabled=${this.currentPage === 1}
        >
          ${html`<img src="${arrowLeftIcon}" alt="Previous" />`}
        </button>
        ${Array.from({ length: this.totalPages }, (_, i) => i + 1).map(
          (page) => html`
            <button
              class="pagination-button ${this.currentPage === page
                ? "active"
                : ""}"
              @click=${() => this.goToPage(page)}
            >
              ${page}
            </button>
          `
        )}
        <button
          class="pagination-button"
          @click=${() => this.goToPage(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages}
        >
          ${html`<img src="${arrowRightIcon}" alt="Next" />`}
        </button>
      </div>
    `;
  }
}

customElements.define("employee-list", EmployeeList);
