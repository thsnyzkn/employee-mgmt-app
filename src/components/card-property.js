import { LitElement, html, css } from "lit";

class CardProperty extends LitElement {
  static properties = {
    label: { type: String },
    title: { type: String },
  };

  static styles = css`
    /*   li {
      border: 1px solid black;
    } */
  `;
  render() {
    return html`
      <div>
        <div>${this.label}</div>
        <div>${this.title}</div>
      </div>
    `;
  }
}

customElements.define("card-property", CardProperty);
