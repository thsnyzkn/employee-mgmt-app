import { html, LitElement, css } from "lit";

class ConfirmModal extends LitElement {
  static styles = css`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      text-align: center;
    }
    .modal-actions button {
      margin: 0 10px;
      padding: 8px 16px;
      cursor: pointer;
    }
  `;

  static properties = {
    message: { type: String },
    onConfirm: { type: Function },
    onCancel: { type: Function },
  };

  render() {
    return html`
      <div class="modal-overlay">
        <div class="modal-content">
          <p>${this.message}</p>
          <div class="modal-actions">
            <button @click=${this.onConfirm}>Confirm</button>
            <button @click=${this.onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("confirm-modal", ConfirmModal);
