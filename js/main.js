// =============================================
//  COMMUNITY MAKERS' MARKET — MAIN JS (v2)
// =============================================

// TRANSLATIONS is loaded from translations.js (included before this script)

let currentLang = localStorage.getItem('cmm-lang') || 'en';
let _langInitDone = false;

// Resolve root-relative asset paths (data.js stores paths like "marketplace photos/...")
// Works correctly from both / (index.html) and /pages/ subpages
const _isInPagesDir = window.location.pathname.includes('/pages/');
function imgPath(rootRelPath) {
  if (!rootRelPath) return null;
  return _isInPagesDir ? '../' + rootRelPath : rootRelPath;
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initLangToggle();
  setActiveNavLink();
  initCounters();
  initSellerForm();
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

// ── SELLER REGISTRATION FORM ──────────────────
function initSellerForm() {
  // Inject modal HTML once
  if (document.getElementById('seller-reg-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'seller-reg-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width:560px;padding:0;overflow:hidden;border-radius:var(--radius-xl)">
      <div style="background:linear-gradient(135deg,rgba(249,168,37,0.12),rgba(156,39,176,0.10));padding:32px 36px 24px;border-bottom:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div style="font-size:2rem;margin-bottom:8px">🛍️</div>
            <h2 style="font-size:1.4rem;font-weight:900;margin-bottom:4px" id="sf-title">Start Selling on CMM</h2>
            <p style="font-size:0.85rem;color:var(--text-secondary)" id="sf-sub">Fill in your details and we'll set up your seller profile.</p>
          </div>
          <button class="modal-close" style="flex-shrink:0;margin-left:16px">✕</button>
        </div>
      </div>
      <form id="seller-reg-form" style="padding:28px 36px 32px;display:flex;flex-direction:column;gap:16px" novalidate>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div>
            <label class="sf-label" for="sf-name" id="lbl-sf-name">Full Name *</label>
            <input class="sf-input" type="text" id="sf-name" placeholder="Your full name" required />
          </div>
          <div>
            <label class="sf-label" for="sf-phone" id="lbl-sf-phone">WhatsApp Number *</label>
            <input class="sf-input" type="tel" id="sf-phone" placeholder="91XXXXXXXXXX" required />
          </div>
        </div>
        <div>
          <label class="sf-label" for="sf-biz" id="lbl-sf-biz">Business / Brand Name *</label>
          <input class="sf-input" type="text" id="sf-biz" placeholder="e.g. Amma's Kitchen" required />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div>
            <label class="sf-label" for="sf-cat" id="lbl-sf-cat">Product Category *</label>
            <select class="sf-input" id="sf-cat" required>
              <option value="">-- Select --</option>
              <option value="food">🍱 Food & Pickles</option>
              <option value="jewelry">💍 Jewellery</option>
              <option value="home-decor">🏺 Home Décor</option>
              <option value="fashion">👘 Fashion & Clothing</option>
              <option value="beauty">🌿 Beauty & Wellness</option>
              <option value="art">🖼️ Art & Paintings</option>
              <option value="gifting">🎁 Gift Hampers</option>
              <option value="other">✨ Other</option>
            </select>
          </div>
          <div>
            <label class="sf-label" for="sf-loc" id="lbl-sf-loc">City / Location *</label>
            <input class="sf-input" type="text" id="sf-loc" placeholder="e.g. Hyderabad" required />
          </div>
        </div>
        <div>
          <label class="sf-label" for="sf-desc" id="lbl-sf-desc">Describe Your Products</label>
          <textarea class="sf-input" id="sf-desc" rows="3" placeholder="Tell buyers what you make, your speciality, years of experience..." style="resize:vertical"></textarea>
        </div>
        <div>
          <label class="sf-label" for="sf-photo" id="lbl-sf-photo">Upload a Product Photo (optional)</label>
          <div id="sf-photo-drop" style="border:2px dashed var(--border);border-radius:var(--radius-md);padding:20px;text-align:center;cursor:pointer;transition:border-color 0.2s" onclick="document.getElementById('sf-photo-input').click()">
            <div id="sf-photo-preview" style="display:none;margin-bottom:10px"><img id="sf-photo-img" style="max-height:120px;border-radius:var(--radius-md);object-fit:cover" /></div>
            <div id="sf-photo-placeholder" style="color:var(--text-muted);font-size:0.87rem">📸 Click to upload or drag & drop<br><span style="font-size:0.78rem">JPG, PNG up to 5MB</span></div>
          </div>
          <input type="file" id="sf-photo-input" accept="image/*" style="display:none" onchange="previewSellerPhoto(this)" />
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;padding:14px;background:rgba(249,168,37,0.05);border:1px solid rgba(249,168,37,0.2);border-radius:var(--radius-md)">
          <input type="checkbox" id="sf-agree" style="margin-top:3px;accent-color:var(--gold);width:16px;height:16px;flex-shrink:0" required />
          <label for="sf-agree" style="font-size:0.83rem;color:var(--text-secondary);cursor:pointer" id="lbl-sf-agree">I agree to list only genuine handmade products and respond to buyer inquiries within 24 hours. I understand all transactions happen directly via WhatsApp.</label>
        </div>
        <div id="sf-error" style="display:none;color:#FF6B8A;font-size:0.83rem;padding:8px 12px;background:rgba(255,107,138,0.08);border-radius:var(--radius-md)"></div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%" id="sf-submit">🚀 Register as Seller</button>
        <p style="text-align:center;font-size:0.8rem;color:var(--text-muted)">Already a seller? <a href="dashboard.html" style="color:var(--gold)">Go to Dashboard →</a></p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .sf-label{display:block;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);margin-bottom:6px}
    .sf-input{width:100%;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary);font-size:0.9rem;font-family:var(--font-body);outline:none;transition:border-color 0.2s;box-sizing:border-box}
    .sf-input:focus{border-color:var(--gold)}
    .sf-input::placeholder{color:var(--text-muted)}
    #sf-photo-drop:hover{border-color:var(--gold)}
    #sf-photo-drop.drag-over{border-color:var(--gold);background:rgba(249,168,37,0.05)}
  `;
  document.head.appendChild(style);

  // Photo drag & drop
  const drop = document.getElementById('sf-photo-drop');
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag-over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('drag-over'));
  drop.addEventListener('drop', e => {
    e.preventDefault(); drop.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadPhotoFile(file);
  });

  // Form submit
  document.getElementById('seller-reg-form').addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('sf-name').value.trim();
    const phone = document.getElementById('sf-phone').value.trim();
    const biz   = document.getElementById('sf-biz').value.trim();
    const cat   = document.getElementById('sf-cat').value;
    const loc   = document.getElementById('sf-loc').value.trim();
    const desc  = document.getElementById('sf-desc').value.trim();
    const agree = document.getElementById('sf-agree').checked;
    const errEl = document.getElementById('sf-error');

    if (!name || !phone || !biz || !cat || !loc) {
      errEl.style.display = 'block';
      errEl.textContent = currentLang === 'te'
        ? '⚠️ దయచేసి అన్ని తప్పనిసరి ఫీల్డ్‌లను పూరించండి.'
        : '⚠️ Please fill in all required fields.';
      return;
    }
    if (!/^\d{10,13}$/.test(phone.replace(/\s/g, ''))) {
      errEl.style.display = 'block';
      errEl.textContent = '⚠️ Enter a valid WhatsApp number (10–13 digits).';
      return;
    }
    if (!agree) {
      errEl.style.display = 'block';
      errEl.textContent = currentLang === 'te'
        ? '⚠️ దయచేసి నిబంధనలను అంగీకరించండి.'
        : '⚠️ Please agree to the seller terms.';
      return;
    }
    errEl.style.display = 'none';

    // Save to localStorage
    const profile = { name, phone, biz, cat, loc, desc, registeredAt: new Date().toISOString() };
    localStorage.setItem('cmm-seller-profile', JSON.stringify(profile));
    localStorage.setItem('cmm-user-role', 'seller');

    // Show success then redirect
    modal.classList.remove('open');
    showToast(`Welcome, ${name}! Your seller profile is ready. 🎉`, '✅', 4000);
    setTimeout(() => {
      const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
      window.location.href = base + 'dashboard.html';
    }, 1500);
  });

  // Wire up all "Start Selling" CTAs
  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-i18n="nav.cta"], .btn-start-selling');
    if (el) {
      ev.preventDefault();
      openSellerModal();
    }
  });
}

function openSellerModal() {
  // Pre-fill if profile exists
  const saved = localStorage.getItem('cmm-seller-profile');
  if (saved) {
    try {
      const p = JSON.parse(saved);
      document.getElementById('sf-name').value  = p.name  || '';
      document.getElementById('sf-phone').value = p.phone || '';
      document.getElementById('sf-biz').value   = p.biz   || '';
      document.getElementById('sf-cat').value   = p.cat   || '';
      document.getElementById('sf-loc').value   = p.loc   || '';
      document.getElementById('sf-desc').value  = p.desc  || '';
    } catch(e) {}
  }
  openModal('seller-reg-modal');
}

function previewSellerPhoto(input) {
  if (input.files && input.files[0]) loadPhotoFile(input.files[0]);
}

function loadPhotoFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('sf-photo-img').src = e.target.result;
    document.getElementById('sf-photo-preview').style.display = 'block';
    document.getElementById('sf-photo-placeholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
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
  openSellerModal,
  imgPath,
};
