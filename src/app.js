import { LitElement, html } from "lit";
import { Router } from "@vaadin/router";

class AppRoot extends LitElement {
  static properties = {
    employees: { type: Array },
  };

  constructor() {
    super();
    this.employees = [
      { id: 1, name: "Tahsin Yazkan", role: "Developer" },
      { id: 2, name: "Sezin Yazkan", role: "Designer" },
    ];
  }

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
        component: "employee-form",
        action: async () => await import("./pages/employee-form.js"),
      },
      { path: "(.*)", redirect: "/" },
    ]);
  }

  render() {
    return html`<header>
        <nav><a @click=${() => Router.go("/add")}>HOME</a></nav>
      </header>
      <div id="outlet"></div>`;
  }
}

customElements.define("app-root", AppRoot);
