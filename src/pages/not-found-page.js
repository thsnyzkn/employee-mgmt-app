import { html, LitElement } from "lit";

class NotFoundPage extends LitElement {
  render() {
    return html`<div>NOT FOUND</div>`;
  }
}

customElements.define("main-element", MainElement);
