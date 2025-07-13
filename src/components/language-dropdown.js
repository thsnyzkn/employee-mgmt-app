import { LitElement, html, css } from "lit";
import { getLocale, setLocale } from "../../locale";
import tr from "../assets/tr.svg";
import us from "../assets/us.svg";

class LanguageDropdown extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    currentLocale: { type: String },
  };

  constructor() {
    super();
    this.isOpen = false;
    this.currentLocale = getLocale();
    this.languages = [
      { code: 'en', name: 'English', flag: us },
      { code: 'tr', name: 'Türkçe', flag: tr }
    ];
    
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleOutsideClick);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleOutsideClick);
  }
  
  handleOutsideClick(e) {
    if (this.isOpen) {
      const dropdown = this.shadowRoot?.querySelector('.language-dropdown');
      if (dropdown) {
        const path = e.composedPath();
        const isInside = path.some(el => el === dropdown);
        
        if (!isInside) {
          this.isOpen = false;
        }
      }
    }
  }

  static styles = css`
    .language-dropdown {
      position: relative;
      display: inline-block;
    }
    
    .language-dropdown-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      padding: 8px 12px;
      gap: 8px;
    }
    
    .language-dropdown-button:hover {
      background-color: rgba(255, 98, 0, 0.1);
      border-color: #ff6200;
    }
    
    .language-dropdown-button img {
      width: 24px;
      height: 24px;
    }
    
    .dropdown-arrow {
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid #666;
      margin-left: 4px;
      transition: transform 0.2s;
    }
    
    .language-dropdown-button.open .dropdown-arrow {
      transform: rotate(180deg);
    }
    
    .language-dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 120px;
      z-index: 1001;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-8px);
      transition: all 0.2s;
      pointer-events: none;
    }
    
    .language-dropdown-menu.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    
    .language-dropdown-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }
    
    .language-dropdown-item:hover {
      background-color: rgba(255, 98, 0, 0.1);
    }
    
    .language-dropdown-item img {
      width: 20px;
      height: 20px;
    }
    
    .language-dropdown-item span {
      font-size: 14px;
      color: #333;
    }
    
    .language-dropdown-item.active {
      background-color: rgba(255, 98, 0, 0.1);
      color: #ff6200;
    }
    
    .language-dropdown-item.active span {
      color: #ff6200;
      font-weight: 500;
    }
  `;

  toggleDropdown(e) {
    e.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  selectLanguage(languageCode) {
    this.currentLocale = languageCode;
    setLocale(languageCode);
    localStorage.setItem('locale', languageCode);
    this.isOpen = false;
    
    // Dispatch custom event to notify parent
    this.dispatchEvent(new CustomEvent('language-changed', {
      detail: { locale: languageCode },
      bubbles: true
    }));
  }

  getCurrentLanguage() {
    return this.languages.find(lang => lang.code === this.currentLocale) || this.languages[0];
  }

  render() {
    return html`
      <div class="language-dropdown">
        <button 
          class="language-dropdown-button ${this.isOpen ? 'open' : ''}"
          @click=${this.toggleDropdown}
        >
          <img 
            src=${this.getCurrentLanguage().flag} 
            alt="${this.getCurrentLanguage().name}"
          />
          <div class="dropdown-arrow"></div>
        </button>
        <div class="language-dropdown-menu ${this.isOpen ? 'open' : ''}">
          ${this.languages.map(lang => html`
            <button 
              class="language-dropdown-item ${lang.code === this.currentLocale ? 'active' : ''}"
              @click=${() => this.selectLanguage(lang.code)}
            >
              <img src=${lang.flag} alt="${lang.name}" />
              <span>${lang.name}</span>
            </button>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define("language-dropdown", LanguageDropdown);
