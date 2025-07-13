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
      padding: 24px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-width: 90vw;
      min-width: 320px;
    }
    
    @media (min-width: 480px) {
      .modal-content {
        padding: 32px;
        min-width: 400px;
      }
    }
    
    .modal-title {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
      line-height: 1.3;
    }
    
    @media (min-width: 480px) {
      .modal-title {
        font-size: 24px;
        margin-bottom: 20px;
      }
    }
    
    .modal-content p {
      margin: 0 0 24px 0;
      font-size: 16px;
      color: #333;
      line-height: 1.5;
    }
    
    @media (min-width: 480px) {
      .modal-content p {
        font-size: 18px;
        margin-bottom: 32px;
      }
    }
    
    .modal-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    @media (min-width: 480px) {
      .modal-actions {
        flex-direction: row;
        justify-content: center;
        gap: 16px;
      }
    }
    
    button {
      padding: 14px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.2s;
      min-height: 48px;
      flex: 1;
    }
    
    @media (min-width: 480px) {
      button {
        flex: 0 1 auto;
        min-width: 120px;
        padding: 12px 24px;
      }
    }
    
    button.confirm {
      background-color: #ff6200;
      color: white;
    }
    
    button.confirm:hover {
      background-color: #e55a00;
    }
    
    button.cancel {
      background-color: white;
      color: #ff6200;
      border: 1px solid #ff6200;
    }
    
    button.cancel:hover {
      background-color: #f8f9fa;
    }
    
    button:active {
      transform: translateY(0);
    }
  `;

  static properties = {
    title: { type: String },
    message: { type: String },
    onConfirm: { type: Function },
    onCancel: { type: Function },
  };

  render() {
    return html`
      <div class="modal-overlay">
        <div class="modal-content">
          ${this.title ? html`<h3 class="modal-title">${this.title}</h3>` : ''}
          <p>${this.message}</p>
          <div class="modal-actions">
            <button class="confirm" @click=${this.onConfirm}>Confirm</button>
            <button class="cancel" @click=${this.onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("confirm-modal", ConfirmModal);
