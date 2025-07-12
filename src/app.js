import { LitElement, html, css } from "lit";
import { Router } from "@vaadin/router";
import logo from "./assets/logo.svg";
import tr from "./assets/tr.svg";
class AppRoot extends LitElement {
  static properties = {
    employees: { type: Array },
  };

  static styles = css`
    .page-container {
      @media (min-width: 768px) {
        max-width: 1440px;
      }
      margin: 0 auto;
    }
    header {
      display: flex;
      justify-content: space-between;
      background-color: white;
      a {
        text-decoration: none;
        color: #ff6200;
        display: flex;
        align-items: center;
      }
      div {
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }
    }

    button {
      all: unset;
      outline: revert;
      margin-right: 4px;
      padding: 4px 8px;
      cursor: pointer;
    }
  `;

  firstUpdated() {
    const outlet = this.shadowRoot.getElementById("outlet");
    const router = new Router(outlet);
    router.setRoutes([
      {
        path: "/",
        component: "employee-list",
        action: async () => await import("./pages/employee-list.js"),
      },
      {
        path: "/add",
        component: "employee-form",
        action: async () => await import("./pages/employee-form.js"),
      },
      {
        path: "/edit/:id",
        action: async (context, commands) => {
          await import("./pages/employee-form.js");
          const employeeForm = commands.component("employee-form");
          employeeForm.employeeId = Number(context.params.id);
          return employeeForm;
        },
      },
      { path: "(.*)", redirect: "/" },
    ]);
  }

  render() {
    return html`
      <header role="banner">
        <a href="/"
          ><img src=${logo} height="40px" width="40px" alt="Ing Logo" /> Ing</a
        >
        <div>
          <a href="/">Employees</a>
          <a href="/add">Add Employee</a>

          <button @click=${this.changeLanguage}>
            <img
              src=${tr}
              height="40px"
              width="40px"
              alt="Turkish Language Selector"
            />
          </button>
        </div>
      </header>
      <div class="page-container">
        <div id="outlet"></div>
      </div>
    `;
  }
}

customElements.define("app-root", AppRoot);
