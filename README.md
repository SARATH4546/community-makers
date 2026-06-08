# 🛍️ Community Makers' Market

> **A bilingual (English & Telugu) digital marketplace platform empowering local homemakers, artisans, and entrepreneurs to discover business ideas, learn skills, sell products, and access government schemes.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Pages](#-pages)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Bilingual Support](#-bilingual-support)
- [WhatsApp Integration](#-whatsapp-integration)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Community Makers' Market (CMM)** is a community-first platform designed for local entrepreneurs in Andhra Pradesh and Telangana. It bridges the gap between talented artisans/homemakers and customers by providing:

- A **no-payment-gateway marketplace** where buyers connect with sellers directly via WhatsApp
- **Free bilingual education** modules in English and Telugu
- A **curated database** of 28+ home-based business ideas with investment & profit estimates
- **Government scheme guides** with step-by-step application processes
- A **community forum** for networking, mentorship, and peer learning

---

## ✨ Features

### 🌐 Bilingual Platform
- Full **English ↔ Telugu** language toggle on every page
- Persistent language preference saved in `localStorage`
- All static and dynamically rendered content switches instantly

### 🛒 WhatsApp-First Marketplace
- **No in-app payments** — buyers are redirected to sellers' WhatsApp with a pre-filled message
- Bilingual WhatsApp messages generated automatically based on selected language
- Product filtering by category, price range, location, and rating

### 💡 Business Ideas Hub
- 28+ curated home-based business ideas
- Filter by category (Cooking, Crafts, Jewellery, Tailoring, Digital, etc.)
- Filter by difficulty level (Beginner, Intermediate, Advanced)
- Investment estimates, profit potential, and market demand indicators
- Detailed modal view with funding links

### 📚 Learning Hub
- 5 structured business modules with lesson-by-lesson progress tracking
- Progress saved in `localStorage` — picks up where you left off
- Video tutorials section
- Downloadable templates (Business Plan, Pricing Calculator, Bookkeeping Register, etc.)

### 🏛️ Government Schemes
- 6 major schemes: MUDRA Loan, PMEGP, SHG, Udyam, Skill India, PMMY
- Step-by-step application accordion
- Direct links to official government portals
- WhatsApp support for guidance

### 👥 Community Forum
- Discussion posts filtered by category
- Upcoming events (online & offline)
- Available mentor profiles with direct WhatsApp contact
- Ask questions via WhatsApp group link

### 📊 Seller Dashboard
- Role-based views: Entrepreneur/Seller, Learner, Customer
- Revenue & order metrics
- Product listing management
- WhatsApp inquiry tracker
- Learning progress overview

---

## 📄 Pages

| Page | Path | Description |
|------|------|-------------|
| **Home** | `index.html` | Landing page with hero, stats, featured ideas, products & stories |
| **Business Ideas** | `pages/ideas.html` | Filterable grid of 28+ business ideas with detail modals |
| **Learn** | `pages/learn.html` | Module-based learning hub with progress tracking |
| **Marketplace** | `pages/marketplace.html` | Product listings with WhatsApp buy integration |
| **Stories** | `pages/stories.html` | Success stories of real local entrepreneurs |
| **Schemes** | `pages/schemes.html` | Government scheme guides with application steps |
| **Community** | `pages/community.html` | Forum, events, and mentors |
| **Dashboard** | `pages/dashboard.html` | Seller/Learner/Customer dashboard |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | HTML5 (Semantic) |
| **Styling** | Vanilla CSS3 (Custom Properties, Grid, Flexbox, Glassmorphism) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Fonts** | Google Fonts — *Outfit* (headings) + *Inter* (body) |
| **Icons** | Emoji-based icons (no external dependency) |
| **Storage** | `localStorage` for language preference & learning progress |
| **Communication** | WhatsApp API (`wa.me`) for buyer-seller connection |
| **Server** | Python `http.server` (local dev) / Any static host |

**Zero dependencies** — No frameworks, no build tools, no npm. Pure HTML/CSS/JS.

---

## 📁 Project Structure

```
community-makers/
│
├── index.html                   # Home / Landing Page
│
├── pages/
│   ├── ideas.html               # Business Ideas Hub
│   ├── learn.html               # Learning Hub (Modules)
│   ├── marketplace.html         # Digital Marketplace
│   ├── stories.html             # Success Stories
│   ├── schemes.html             # Government Schemes
│   ├── community.html           # Community Forum
│   └── dashboard.html           # Seller/Learner Dashboard
│
├── css/
│   └── style.css                # Global styles, design tokens, components
│
├── js/
│   ├── translations.js          # EN/TE translation dictionary (500+ keys)
│   ├── data.js                  # All app data (products, ideas, stories, modules, schemes)
│   └── main.js                  # Core JS: navbar, language toggle, modals, WhatsApp, counters
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Any modern browser (Chrome, Firefox, Edge, Safari)
- Python 3 (for local dev server) OR any static file server

### Run Locally

**Option 1 — Python (recommended):**
```bash
# Clone the repository
git clone https://github.com/SARATH4546/community-makers.git
cd community-makers

# Start local server
python -m http.server 3000

# Open in browser
# http://localhost:3000
```

**Option 2 — VS Code Live Server:**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**

**Option 3 — Direct file:**
> Simply double-click `index.html` — though some features may require a server context.

---

## 🌐 Bilingual Support

The platform supports **full EN ↔ TE (Telugu)** switching.

### How it works

```
translations.js          ← Dictionary of 500+ key-value pairs for EN and TE
     ↓
main.js (applyLang)      ← Iterates [data-i18n] attributes and updates textContent
     ↓
CMM_RERENDER(lang)       ← Each page re-renders dynamic cards/lists with translated labels
```

### Adding a new translation key

1. Open `js/translations.js`
2. Add your key to both `en` and `te` objects:
```js
// English
'my.new.key': 'Hello World',

// Telugu
'my.new.key': 'హలో వరల్డ్',
```
3. Use it in HTML:
```html
<span data-i18n="my.new.key">Hello World</span>
```
4. Or use it in JavaScript:
```js
const label = CMM.t('my.new.key');
```

---

## 💬 WhatsApp Integration

Buyers are **never redirected to a payment page**. Instead, clicking "Buy via WhatsApp" opens a WhatsApp chat with a **pre-filled, bilingual message**:

**English message:**
```
Hello Priya Lakshmi! 👋

I'm interested in buying your product:

📦 *Homemade Mango Pickle*
💰 Price: ₹299

Found on Community Makers' Market. Is this available? Please share more details.
```

**Telugu message:**
```
నమస్కారం Priya Lakshmi! 👋

మీ ఉత్పత్తి కొనాలని ఆసక్తిగా ఉంది:

📦 *Homemade Mango Pickle*
💰 ధర: ₹299

కమ్యూనిటీ మేకర్స్ మార్కెట్ లో చూశాను. అందుబాటులో ఉందా?
```

### Adding a new product (seller)
Edit `js/data.js` and add to the `products` array:
```js
{
  id: 13,
  name: 'Your Product Name',
  seller: 'Seller Name',
  sellerPhone: '919XXXXXXXXX',   // WhatsApp number with country code (no +)
  price: 499,
  originalPrice: 699,
  category: 'food',              // food | jewelry | home-decor | fashion | beauty | art | gifting
  location: 'Hyderabad',
  emoji: '🍯',
  rating: 4.5,
  reviews: 12,
  desc: 'Product description here.',
}
```

---

## 🎨 Design System

The platform uses a **dark-mode glassmorphism** aesthetic with a curated color palette:

| Token | Value | Usage |
|-------|-------|-------|
| `--gold` | `#F9A825` | Primary accent, prices, highlights |
| `--teal` | `#00BFA5` | Secondary accent, success states |
| `--purple` | `#9C27B0` | Learning, modules |
| `--rose` | `#FF6B8A` | Stories, alerts |
| `--bg-primary` | `#0A0A0F` | Main background |
| `--bg-card` | `#13131A` | Card backgrounds |
| `--font-heading` | Outfit | All headings |
| `--font-body` | Inter | Body text |

---

## 📱 Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| `< 600px` | Single column, mobile nav |
| `600px – 1024px` | 2-column grids, collapsible sidebar |
| `> 1024px` | Full 4-column grids, sticky sidebar |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a **Pull Request**

### Ideas for contributions
- Add more business ideas to `js/data.js`
- Add more products/stories/schemes data
- Improve Telugu translations in `js/translations.js`
- Add more government schemes
- Improve mobile UX
- Add PWA support (offline, installable)

---

## 📊 Platform Stats

| Metric | Value |
|--------|-------|
| Business Ideas | 28+ |
| Learning Modules | 5 |
| Government Schemes | 6 |
| Product Categories | 7 |
| Languages | 2 (EN + TE) |
| External Dependencies | 0 |

---

> *"Empowering every homemaker, artisan, and dreamer to build a business — right from home."*
> 
> — Community Makers' Market
