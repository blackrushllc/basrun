(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const toastHost = (() => {
    let host = $('.toast-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toast-host';
      host.setAttribute('aria-live', 'polite');
      host.setAttribute('aria-relevant', 'additions');
      document.body.appendChild(host);
    }
    return host;
  })();

  function showToast(title, text) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML = `
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-text">${escapeHtml(text)}</div>
    `;
    toastHost.appendChild(el);
    window.setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 250ms ease';
      window.setTimeout(() => el.remove(), 260);
    }, 3800);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function initMobileNav() {
    const header = $('.site-header');
    const toggle = $('#navToggle');
    const links = $('#navLinks');
    if (!header || !toggle || !links) return;

    toggle.addEventListener('click', () => {
      const open = header.getAttribute('data-open') === 'true';
      header.setAttribute('data-open', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      links.setAttribute('data-open', open ? 'false' : 'true');
    });

    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 861px)').matches) {
        header.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initThemeToggle() {
    const btn = $('#themeToggle');
    if (!btn) return;

    const key = 'basrun_theme';
    const saved = localStorage.getItem(key);
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }

    const render = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      btn.innerHTML = isDark ? sunIcon() : moonIcon();
    };

    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(key, next);
      render();
    });

    render();
  }

  function moonIcon() {
    return `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M21 13.2A8.2 8.2 0 1 1 10.8 3a6.9 6.9 0 0 0 10.2 10.2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  function sunIcon() {
    return `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" stroke-width="2"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  }

  function initDemoForms() {
    $$('form[data-demo-form="true"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Demo only', 'This is a UI mock — no backend is connected.');
      });
    });
  }

  function initDocsActiveLink() {
    const sidebar = $('.sidebar');
    if (!sidebar) return;
    const path = (location.pathname || '').split('/').pop();
    if (!path) return;

    const links = $$('a[href]', sidebar);
    links.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const file = href.split('/').pop();
      if (file && file === path) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  function initModal() {
    const openBtn = $('[data-modal-open]');
    const closeBtns = $$('[data-modal-close]');
    const backdrop = $('#modalBackdrop');
    const modal = $('#modal');
    if (!backdrop || !modal) return;

    const close = () => {
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const open = () => {
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const first = $('input,select,button,textarea,a[href]', modal);
      if (first) first.focus();
    };

    if (openBtn) openBtn.addEventListener('click', open);
    closeBtns.forEach((b) => b.addEventListener('click', close));
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.getAttribute('aria-hidden') === 'false') close();
    });

    $$('[data-demo-toast]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (btn.tagName.toLowerCase() === 'a') {
          const href = btn.getAttribute('href') || '';
          if (href && href !== '#') return;
        }
        e.preventDefault();
        showToast('Demo only', btn.getAttribute('data-demo-toast') || 'Not connected to a backend.');
      });
    });
  }

  function initEntryPointSuggest() {
    const mode = $('#pkgMode');
    const entry = $('#entryPoint');
    if (!mode || !entry) return;
    const set = () => {
      const v = mode.value;
      if (v === 'scheduled') entry.value = 'main.basil';
      if (v === 'webhook') entry.value = 'webhook.basil';
      if (v === 'rest') entry.value = 'api.basil';
    };
    mode.addEventListener('change', set);
    set();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initThemeToggle();
    initDemoForms();
    initDocsActiveLink();
    initModal();
    initEntryPointSuggest();
  });
})();
