import { LitElement, html, css } from "lit";
import { Router } from "@vaadin/router";
import logo from "./assets/logo.svg";
import tr from "./assets/tr.svg";
class AppRoot extends LitElement {
  static properties = {
    employees: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }

    .page-container {
      padding: 16px;
      margin: 0 auto;
      max-width: 100%;
    }

    @media (min-width: 768px) {
      .page-container {
        max-width: 1440px;
        padding: 32px;
      }
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      padding: 0px 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
      min-height: 72px;
    }

    .header-logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #ff6200;
      font-weight: bold;
      gap: 12px;
      font-size: 20px;
      flex-shrink: 0;
    }

    .header-logo img {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .header-nav a {
      text-decoration: none;
      color: #ff6200;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      transition: background-color 0.2s;
      white-space: nowrap;
    }

    .header-nav a:hover {
      background-color: rgba(255, 98, 0, 0.1);
    }

    .header-nav button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .header-nav button:hover {
      background-color: rgba(255, 98, 0, 0.1);
      border-color: #ff6200;
    }

    .header-nav button img {
      width: 24px;
      height: 24px;
    }

    @media (max-width: 640px) {
      header {
        align-items: center;
        padding: 16px;
        gap: 16px;
        min-height: auto;
      }

      .header-logo {
        font-size: 18px;
      }

      .header-logo img {
        width: 36px;
        height: 36px;
      }

      .header-nav {
        justify-content: center;
        gap: 12px;
        width: 100%;
      }

      .header-nav a {
        font-size: 14px;
        padding: 10px 16px;
        flex: 1;
        text-align: center;
        min-width: 0;
      }
    }

    @media (max-width: 480px) {
      .header-nav {
        gap: 8px;
      }

      .header-nav a {
        width: 100%;
        text-align: center;
        padding: 12px 20px;
      }
    }

    button {
      all: unset;
      outline: revert;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: rgba(255, 98, 0, 0.1);
    }

    button img {
      vertical-align: middle;
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

  changeLanguage() {}

  render() {
    return html`
      <header role="banner">
        <a href="/" class="header-logo">
          <img src=${logo} alt="Ing Logo" />
          <span>Ing</span>
        </a>
        <nav class="header-nav">
          <a href="/">Employees</a>
          <a href="/add">Add Employee</a>
          <button @click=${this.changeLanguage}>
            <img
              src=${tr}
              width="24"
              height="24"
              alt="Turkish Language Selector"
            />
          </button>
        </nav>
      </header>
      <div class="page-container">
        <div id="outlet"></div>
      </div>
    `;
  }
}

customElements.define("app-root", AppRoot);
