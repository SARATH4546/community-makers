// =============================================
//  COMMUNITY MAKERS' MARKET — MAIN JS (v2)
// =============================================

// TRANSLATIONS is loaded from translations.js (included before this script)

let currentLang = localStorage.getItem('cmm-lang') || 'en';
let _langInitDone = false;

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initLangToggle();
  setActiveNavLink();
  initCounters();
  // Apply translations only (skip CMM_RERENDER — page scripts call render on their own)
  applyLang(currentLang, true);
  _langInitDone = true;
});

// ── NAVBAR ──────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      const isOpen = mobileMenu.classList.contains('open');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
      spans[1].style.opacity  = isOpen ? '0' : '1';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }
}

// ── ACTIVE NAV LINK ──────────────────────────
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop() || 'index.html';
    const currentFile = path.split('/').pop() || 'index.html';
    link.classList.toggle('active', linkFile === currentFile || (currentFile === '' && href.includes('index')));
  });
}

// ── SCROLL REVEAL ────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Expose for dynamic content added later
function observeNewRevealElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ── LANGUAGE TOGGLE ──────────────────────────
function initLangToggle() {
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'te' : 'en';
      localStorage.setItem('cmm-lang', currentLang);
      applyLang(currentLang);
      // Trigger page-specific re-render if defined
      if (typeof window.CMM_RERENDER === 'function') window.CMM_RERENDER(currentLang);
    });
  });
}

function applyLang(lang, skipRerender = false) {
  const t = TRANSLATIONS[lang];
  if (!t) return;

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Update language toggle button text
  document.querySelectorAll('.lang-text').forEach(el => {
    el.textContent = t['nav.lang.toggle'] || (lang === 'en' ? 'తెలుగు' : 'English');
  });

  // Update html lang attribute
  document.documentElement.lang = lang === 'te' ? 'te' : 'en';

  // Trigger page-specific re-render (for already-rendered dynamic content)
  if (!skipRerender && typeof window.CMM_RERENDER === 'function') {
    window.CMM_RERENDER(lang);
  }
}

// Helper: get translation
function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) || key;
}

// ── TOAST ────────────────────────────────────
function showToast(message, emoji = '✅', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${emoji}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── MODAL ────────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (e.target.classList.contains('modal-close')) {
    const overlay = e.target.closest('.modal-overlay');
    if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  }
});

// ── WHATSAPP HELPER ──────────────────────────
function openWhatsApp(phone, productName, sellerName, price) {
  const isTe = currentLang === 'te';
  const msg = isTe
    ? encodeURIComponent(`నమస్కారం ${sellerName}! 👋\n\nమీ ఉత్పత్తి కొనాలని ఆసక్తిగా ఉంది:\n\n📦 *${productName}*\n💰 ధర: ₹${price}\n\nకమ్యూనిటీ మేకర్స్ మార్కెట్ లో చూశాను. అందుబాటులో ఉందా?`)
    : encodeURIComponent(`Hello ${sellerName}! 👋\n\nI'm interested in buying your product:\n\n📦 *${productName}*\n💰 Price: ₹${price}\n\nFound on Community Makers' Market. Is this available? Please share more details.`);
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

// ── ANIMATED COUNTER ─────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(c => observer.observe(c));
}

// Expose globals
window.CMM = {
  openWhatsApp,
  showToast,
  openModal,
  closeModal,
  t,
  currentLang: () => currentLang,
  applyLang,
  observeNewRevealElements,
};
