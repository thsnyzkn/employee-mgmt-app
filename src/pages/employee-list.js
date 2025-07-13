import { html, LitElement, css } from "lit";
import { msg, str, updateWhenLocaleChanges } from "@lit/localize";
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
    :host {
      display: block;
      padding-bottom: 80px; /* Space for fixed pagination */
    }

    section {
      margin: 0 0 24px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    @media (min-width: 768px) {
      section {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
      }
    }

    h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    @media (max-width: 767px) {
      h2 {
        font-size: 20px;
        text-align: center;
      }
    }

    .search-container {
      flex: 1;
      max-width: 100%;
      margin-bottom: 0;
    }

    @media (min-width: 768px) {
      .search-container {
        max-width: 400px;
        margin-right: 16px;
      }
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    .button-wrapper {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
    }

    @media (min-width: 768px) {
      .button-wrapper {
        justify-content: flex-end;
        flex-wrap: nowrap;
      }
    }

    .pagination-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      z-index: 100;
      overflow-x: auto;
    }

    @media (min-width: 768px) {
      .pagination-container {
        gap: 16px;
        padding: 16px;
      }
    }

    .pagination-button {
      padding: 8px;
      border: none;
      background-color: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      min-height: 36px;
      border-radius: 50%;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .pagination-button:not(:has(img)) {
      border: 1px solid #ccc;
      background-color: #f9f9f9;
      font-size: 14px;
      font-weight: 500;
    }

    @media (min-width: 768px) {
      .pagination-button {
        min-width: 40px;
        min-height: 40px;
      }

      .pagination-button:not(:has(img)) {
        font-size: 16px;
      }
    }

    .pagination-button.active {
      background-color: #ff6200;
      color: white;
      border-color: #ff6200;
      transform: scale(1.1);
    }

    .pagination-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .pagination-button:not(:disabled):hover {
      background-color: #ff6200;
      color: white;
      border-color: #ff6200;
    }

    .pagination-button.active:not(:disabled):hover {
      background-color: #e55a00;
    }

    button {
      all: unset;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      background-color: transparent;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.2s;
      font-size: 14px;
      white-space: nowrap;
    }

    @media (min-width: 768px) {
      button {
        padding: 8px 16px;
        font-size: 16px;
      }
    }

    button:hover:not(:disabled) {
      background-color: #f5f5f5;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    button img {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    @media (min-width: 768px) {
      button img {
        width: 18px;
        height: 18px;
      }
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
    this.modalTitle = "";
    this.confirmAction = () => {};
    updateWhenLocaleChanges(this);
  }

  handleSelectionChanged(e) {
    this.selectedEmployeeIds = e.detail.selectedIds;
  }

  deleteSelected() {
    this.modalMessage = msg(
      "Are you sure you want to delete the selected employees?"
    );
    this.confirmAction = () => {
      store.dispatch(deleteSelectedEmployees(this.selectedEmployeeIds));
      this.selectedEmployeeIds = [];
      this.isModalVisible = false;
    };
    this.isModalVisible = true;
  }

  deleteSingleEmployee(employeeId) {
    const employee = this.employees.find((emp) => emp.id === employeeId);
    this.modalTitle = msg(
      str`Confirm Delete ${employee.firstName} ${employee.lastName}`
    );
    this.modalMessage = msg("Are you sure you want to delete this employee?");
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
    return html`
      ${this.isModalVisible
        ? html`
            <confirm-modal
              .title=${this.modalTitle}
              .message=${this.modalMessage}
              .onConfirm=${this.confirmAction}
              .onCancel=${() => (this.isModalVisible = false)}
            ></confirm-modal>
          `
        : ""}
      <section>
        <h2>${msg("Employee List")}</h2>
        <div class="search-container">
          <input
            class="search-input"
            type="text"
            .value=${this.searchQuery}
            @input=${this.updateSearch}
            placeholder="${msg("Search by name, department, or position...")}"
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
