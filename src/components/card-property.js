import { LitElement, html, css } from "lit";
import { msg, updateWhenLocaleChanges } from "@lit/localize";

class CardProperty extends LitElement {
  static properties = {
    label: { type: String },
    title: { type: String },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  static styles = css`
    #wrapper {
      display: flex;
      flex-direction: column;
    }
    #label {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }
  `;
  render() {
    return html`
      <div id="wrapper">
        <span id="label">${this.label}</span>
        <span>${this.title}</span>
      </div>
    `;
  }
}

customElements.define("card-property", CardProperty);
