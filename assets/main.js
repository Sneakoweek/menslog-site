/**
 * Men's Log — Main Client Script
 * Handles dual-language switching (EN default / RU) and UI interactions.
 */

(function () {
  'use strict';

  // Supported languages
  var DEFAULT_LANG = 'en';
  var STORAGE_KEY = 'menslog_lang';

  function getInitialLang() {
    // 1. URL parameter (?lang=ru or ?lang=en)
    var params = new URLSearchParams(window.location.search);
    var langParam = params.get('lang');
    if (langParam && (langParam === 'en' || langParam === 'ru')) {
      return langParam;
    }

    // 2. Local storage
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'ru')) {
        return saved;
      }
    } catch (e) {
      // LocalStorage might be restricted; ignore
    }

    // 3. Default to English (mandatory for Google OAuth verification)
    return DEFAULT_LANG;
  }

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'ru') lang = 'en';

    document.documentElement.setAttribute('lang', lang);
    document.body.setAttribute('data-lang', lang);

    // Update active button states
    var buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(function (btn) {
      var btnLang = btn.getAttribute('data-lang-btn');
      if (btnLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Update dynamic document title if data-title-en/ru are defined
    var pageTitleEl = document.querySelector('title');
    if (pageTitleEl) {
      var titleEn = pageTitleEl.getAttribute('data-title-en');
      var titleRu = pageTitleEl.getAttribute('data-title-ru');
      if (lang === 'ru' && titleRu) {
        pageTitleEl.textContent = titleRu;
      } else if (titleEn) {
        pageTitleEl.textContent = titleEn;
      }
    }

    // Persist
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  // Initialize once DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    var initialLang = getInitialLang();
    setLanguage(initialLang);

    // Attach click listeners to language toggle buttons
    var buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetLang = this.getAttribute('data-lang-btn');
        setLanguage(targetLang);
      });
    });
  });
})();
