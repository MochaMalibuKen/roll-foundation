// Internationalization system for ROLL Foundation
class I18n {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.translations = {};
    this.init();
  }

  async init() {
    await this.loadTranslations();
    this.updatePageContent();
    this.updateLanguageToggle();
    this.setupEventListeners();
  }

  async loadTranslations() {
    try {
      // Load both English and Spanish translations
      const [enResponse, esResponse] = await Promise.all([
        fetch('./i18n/en.json'),
        fetch('./i18n/es.json')
      ]);

      this.translations.en = await enResponse.json();
      this.translations.es = await esResponse.json();
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English if loading fails
      this.currentLanguage = 'en';
    }
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    this.updatePageContent();
    this.updateLanguageToggle();
  }

  getNestedTranslation(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }
    
    return value;
  }

  updatePageContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getNestedTranslation(key);
      
      if (translation) {
        // Handle special cases like footer year replacement
        if (translation.includes('{{year}}')) {
          const currentYear = new Date().getFullYear();
          element.innerHTML = translation.replace('{{year}}', currentYear);
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update document language attribute
    document.documentElement.lang = this.currentLanguage;
  }

  updateLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;

    const langSpan = langToggle.querySelector('span[data-i18n="nav.lang"]');
    const langAltSpan = langToggle.querySelector('span[data-i18n="nav.lang_alt"]');
    
    if (langSpan && this.translations[this.currentLanguage]) {
      langSpan.textContent = this.translations[this.currentLanguage].nav.lang;
    }
    
    if (langAltSpan && this.translations[this.currentLanguage]) {
      langAltSpan.textContent = this.translations[this.currentLanguage].nav.lang_alt;
    }
  }

  toggleLanguage() {
    const newLang = this.currentLanguage === 'en' ? 'es' : 'en';
    this.setLanguage(newLang);
  }

  setupEventListeners() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => this.toggleLanguage());
    }
  }

  // Method for updating countdown text dynamically
  updateCountdownText() {
    const countdownTitle = document.querySelector('.countdown-title');
    if (countdownTitle) {
      const translation = this.getNestedTranslation('shesroll.countdown_live');
      if (translation) {
        countdownTitle.textContent = translation;
      }
    }
  }
}

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new I18n();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}

// Note: HTML markup (script tags and navigation) must be placed in your HTML files, not in this JavaScript module.
// Example: add the following to the <head> of your HTML file:
// <script src="./js/i18n.js"></script>
// And place the navigation markup inside the <body> where appropriate.