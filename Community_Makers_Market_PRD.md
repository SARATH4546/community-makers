# Community Makers' Market — Product Requirements Document

## 1. Overview

| Field | Value |
|-------|-------|
| **Product Name** | Community Makers' Market |
| **Tagline** | "Support Local Talent, Build a Stronger Community" |
| **Purpose** | A bilingual (English + Telugu) community service platform that empowers homemakers, students, artists, self-help groups (SHGs), local creators, and aspiring entrepreneurs to discover home-based business opportunities, learn entrepreneurial skills, and sell products directly to local buyers. |
| **Target Users** | Homemakers, students, artists, SHG members, local creators, village secretariats, NGOs, community organizations |
| **Monetization** | None (community service platform; no payment gateway) |

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start v1 (React 19, SSR/SSG, file-based routing) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (native CSS @import, semantic design tokens) |
| Animations | Framer Motion |
| UI Components | shadcn/ui (Dialog, Button, Badge, Tabs, Input, Textarea, Select, etc.) |
| State (client) | React Context API + localStorage |
| State (server) | Not used (no backend database; pure client-side persistence) |
| Build Tool | Vite 7 |

---

## 3. Information Architecture

### 3.1 Routes (Pages)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/routes/index.tsx` | **Homepage**: Hero, stats counter, challenges/solutions, workflow journey, skill center, women/youth empowerment, success stories, impact dashboard, CTA |
| `/business-ideas` | `src/routes/business-ideas.tsx` | **Business Ideas Hub**: Grid of ~40 curated home-based business ideas with startup costs, skill levels, and earning potential. Click opens detail modal. |
| `/marketplace` | `src/routes/marketplace.tsx` | **Community Marketplace**: Browse products from seed data + registered sellers. Category filtering. No online payments — buyers contact sellers directly. |
| `/product/$id` | `src/routes/product.$id.tsx` | **Product Detail Page**: Full product info, seller details, "Contact Seller" CTA. |
| `/sell` | `src/routes/sell.tsx` | **Seller Registration**: 7-step community workflow + registration form (name, email, phone, location, business name, category, description). |
| `/seller-dashboard` | `src/routes/seller-dashboard.tsx` | **Seller Dashboard**: Tabbed interface — My Profile (view/edit), My Products (CRUD), Customer Inquiries (read-only list). |
| `/success-stories` | `src/routes/success-stories.tsx` | **Success Stories**: Realistic portraits, testimonials, growth metrics for community entrepreneurs. |
| `/schemes` | `src/routes/schemes.tsx` | **Government Schemes**: Searchable list of Indian government support programs (PMEGP, Mudra, etc.) with eligibility, benefits, and application info. |
| `/about` | `src/routes/about.tsx` | **About Us**: Mission, vision, and platform story. |
| `/contact` | `src/routes/contact.tsx` | **Contact Page**: Contact form + FAQ accordion + social links. |
| `/sitemap.xml` | `src/routes/sitemap[.]xml.ts` | **Dynamic sitemap** for SEO. |

### 3.2 Layout / Shell

| Component | File | Purpose |
|-----------|------|---------|
| Root Layout | `src/routes/__root.tsx` | HTML shell, global providers (Language, Theme, Seller), Navbar, Footer, `<Outlet />` |
| Navbar | `src/components/Navbar.tsx` | Logo, nav links (Home, Ideas, Marketplace, Stories, Schemes, About, Contact), language toggle (EN/TE), conditional "Start Selling" / "Seller Dashboard" button |
| Footer | `src/components/Footer.tsx` | Quick links, community resources, contact info, social links, copyright |

---

## 4. Data Models

### 4.1 Business Idea (`BusinessIdea`)
Stored in `src/data/content.ts` — static seed data.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique slug (e.g., "candles", "pickles") |
| `icon` | `string` | Emoji representing the idea |
| `image` | `string` | Photo/illustration asset (still in data, but UI now shows emoji) |
| `title` | `Bi` | Bilingual title (English + Telugu) |
| `tagline` | `Bi` | Short description |
| `cost` | `Bi` | Startup cost range (e.g., "₹3,000 – ₹8,000") |
| `skill` | `Bi` | Skill level (Beginner / Intermediate / Advanced) |
| `earning` | `Bi` | Monthly earning potential |
| `overview` | `Bi` | Detailed business overview |
| `materials` | `Bi[]` | List of required materials |
| `steps` | `Bi[]` | Step-by-step startup guide |
| `pricing` | `Bi` | Pricing suggestions |
| `marketing` | `Bi[]` | Marketing tips |
| `expected` | `Bi` | Expected earnings narrative |
| `challenges` | `Bi[]` | Common challenges |
| `tips` | `Bi[]` | Success tips |

### 4.2 Seller (`Seller`)
Stored in `localStorage` key `cmm-sellers`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Auto-generated UUID |
| `fullName` | `string` | Seller's full name |
| `email` | `string` | Contact email |
| `phone` | `string` | Contact phone |
| `location` | `string` | City / village |
| `businessName` | `string` | Display business name |
| `category` | `string` | One of 8 seller categories (see below) |
| `description` | `string` | Short business description |
| `createdAt` | `string` | ISO timestamp |

**Seller Categories** (8):
1. Handmade Crafts
2. Homemade Food
3. Jewelry
4. Tailoring
5. Art & Paintings
6. Home Decor
7. Customized Gifts
8. Plants & Gardening

### 4.3 Seller Product (`SellerProduct`)
Stored in `localStorage` key `cmm-seller-products`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Auto-generated UUID |
| `sellerId` | `string` | FK to Seller |
| `name` | `string` | Product name |
| `description` | `string` | Product description |
| `category` | `string` | Category key |
| `price` | `string` | Price as string (e.g., "₹250") |
| `image` | `string?` | Base64 data URL (optional) |
| `createdAt` | `string` | ISO timestamp |

### 4.4 Inquiry (`Inquiry`)
Stored in `localStorage` key `cmm-inquiries`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Auto-generated UUID |
| `name` | `string` | Customer name |
| `email` | `string` | Customer email |
| `phone` | `string` | Customer phone |
| `message` | `string` | Inquiry message |
| `subject` | `string` | Product or topic name |
| `sellerId` | `string?` | Target seller (if product inquiry) |
| `productId` | `string?` | Target product (if product inquiry) |
| `productName` | `string?` | Denormalized product name |
| `createdAt` | `string` | ISO timestamp |

### 4.5 Seed Marketplace Products
Stored in `src/data/content.ts` — static demo products merged with seller products at runtime.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique ID |
| `name` | `Bi` | Bilingual product name |
| `price` | `string` | Price |
| `seller` | `Bi` | Bilingual seller name |
| `categoryKey` | `string` | Category slug |
| `category` | `Bi` | Bilingual category label |
| `desc` | `Bi` | Bilingual description |
| `image` | `string` | Product photo asset |
| `emoji` | `string` | Fallback emoji |

---

## 5. Feature Specifications

### 5.1 Bilingual Support (English + Telugu)
- **Architecture**: Every UI string and content string is stored as a `Bi` object `{ en: string, te: string }`.
- **Translation file**: `src/i18n/translations.ts` — central UI dictionary.
- **Content file**: `src/data/content.ts` — all business ideas, stories, schemes, etc. use the `b(en, te)` helper.
- **Language state**: `LanguageContext` stores current language (`"en" | "te"`).
- **Language Gate**: On first visit, users select English or Telugu before entering the site. Choice persisted in `localStorage`.
- **Toggle**: Navbar language switcher allows switching anytime.

### 5.2 Business Ideas Hub
- **Grid**: 3-column responsive grid of business idea cards.
- **Card content**: Large emoji, title, tagline, startup cost, skill level, earning potential, "Learn More" button.
- **Modal**: Clicking "Learn More" opens a detail modal with:
  - Overview
  - Required Materials (badges)
  - Step-by-Step Guide (numbered list)
  - Pricing Suggestions
  - Marketing Tips
  - Expected Earnings (highlighted box)
  - Common Challenges & Success Tips (2-column)
- **Ideas count**: ~40 ideas across categories:
  - Food (pickles, snacks, baking)
  - Crafts (candles, jewelry, crochet, paintings, decor)
  - Services (tailoring, nursery, gifts)
  - Under ₹100 startups (bookmarks, friendship bands, origami, greeting cards, etc.)
  - Under ₹200 startups (hair bows, scrunchies, beaded jewelry, phone charms, etc.)
  - Creative products (calligraphy, painted stones, mandalas, scrapbooks, etc.)

### 5.3 Seller System

#### 5.3.1 Registration (`/sell`)
- **Community Workflow**: Visual 7-step journey (Discover Skill → Learn → Plan → Setup → Create → Market → Earn) displayed at top.
- **Form fields**:
  - Full Name (text)
  - Email (email)
  - Phone Number (tel)
  - Location (text)
  - Business Name (text)
  - Business Category (select dropdown — 8 options)
  - Short Business Description (textarea)
- **Validation**: Required fields, basic email/phone format.
- **Persistence**: Saved to `localStorage` (`cmm-sellers`).
- **Auto-login**: After registration, seller is automatically "logged in" (`cmm-current-seller` key).
- **Success message**: "Welcome! Your seller profile has been created."

#### 5.3.2 Seller Dashboard (`/seller-dashboard`)
- **Tab 1 — My Profile**: View all registration details. "Edit Profile" mode with inline form + Save/Cancel.
- **Tab 2 — My Products**:
  - List of seller's products (image, name, price, category).
  - "Add Product" button → opens `ProductFormModal`.
  - "Edit" and "Delete" actions per product.
  - Product form fields: Name, Category (select), Price, Description, Image Upload (file → Base64 data URL).
  - Empty state: "No products yet. Add your first product to appear in the marketplace."
- **Tab 3 — Customer Inquiries**:
  - Table/list of inquiries linked to this seller.
  - Columns: Customer Name, Product, Message, Received Date.
  - Empty state: "No customer inquiries yet."

#### 5.3.3 Marketplace Integration
- Seller products appear alongside seed products in `/marketplace`.
- Seller products displayed first in the combined list.
- Each product card shows: image/emoji, category badge, name, seller name, price, "View Details" and "Contact Seller" buttons.
- **No online payments**: Platform only facilitates discovery and contact.

### 5.4 Contact / Inquiry System
- **Contact Form Modal** (`ContactFormModal`):
  - Fields: Name, Email, Phone, Message.
  - Can be pre-filled with product context (subject, sellerId, productId).
  - Accessible from: Marketplace cards, Product Detail page, Contact page.
- **Persistence**: All inquiries saved to `localStorage` (`cmm-inquiries`).
- **Seller view**: Inquiries filtered by `sellerId` appear in the Seller Dashboard.

### 5.5 Government Schemes (`/schemes`)
- Searchable/filterable list of Indian government entrepreneurship schemes.
- Each scheme card shows: name, description, eligibility, benefits, application process.
- Static seed data in `src/data/content.ts`.

### 5.6 Success Stories (`/success-stories`)
- Realistic portrait photos of community entrepreneurs.
- Each story: photo, name, role, testimonial quote, growth metric.
- Women and Youth empowerment sections with dedicated imagery.

---

## 6. Component Inventory

### 6.1 Reusable Components

| Component | File | Purpose |
|-------------|------|---------|
| `SectionHeading` | `src/components/SectionHeading.tsx` | Standard section title + subtitle with animation |
| `AnimatedCounter` | `src/components/AnimatedCounter.tsx` | Number count-up animation for stats |
| `BusinessIdeaModal` | `src/components/BusinessIdeaModal.tsx` | Detail modal for business ideas |
| `ContactFormModal` | `src/components/ContactFormModal.tsx` | Reusable contact/inquiry form in a dialog |
| `ProductFormModal` | `src/components/ProductFormModal.tsx` | Seller product add/edit form with image upload |
| `Navbar` | `src/components/Navbar.tsx` | Top navigation with conditional seller buttons |
| `Footer` | `src/components/Footer.tsx` | Site footer |
| `LanguageGate` | `src/components/LanguageGate.tsx` | First-time language selection overlay |

### 6.2 Context Providers

| Context | File | Purpose |
|---------|------|---------|
| `LanguageContext` | `src/i18n/LanguageContext.tsx` | Current language state, `t()` and `tr()` helpers |
| `SellerContext` | `src/contexts/SellerContext.tsx` | Current seller state, auto-refresh on registration/logout |
| `ThemeContext` | `src/contexts/ThemeContext.tsx` | Light/dark mode toggle |

### 6.3 Utility Modules

| Module | File | Purpose |
|--------|------|---------|
| `sellers` | `src/lib/sellers.ts` | CRUD for sellers and products in localStorage |
| `market` | `src/lib/market.ts` | Merges seller products + seed products for marketplace |
| `inquiries` | `src/lib/inquiries.ts` | CRUD for customer inquiries in localStorage |
| `translations` | `src/i18n/translations.ts` | Central UI bilingual dictionary |
| `content` | `src/data/content.ts` | All static seed data (ideas, products, stories, schemes, skills, workflow, etc.) |

---

## 7. Visual Design System

### 7.1 Design Tokens (from `src/styles.css`)
- **Primary**: Blue gradient (`--gradient-hero`)
- **Teal accent**: `--gradient-teal`
- **Gold accent**: `--gradient-gold` / `--gradient-warm`
- **Card backgrounds**: `bg-card` with `shadow-soft`
- **Border radius**: Large (`rounded-3xl`, `rounded-2xl`) for cards; `rounded-full` for chips
- **Typography**: Sans-serif, tight tracking on headings
- **Dark mode**: Fully supported via CSS variables

### 7.2 Visual Style
- **Photography**: Realistic photos for hero, success stories, women/youth sections, marketplace products, contact banner, schemes banner.
- **Business Ideas**: Large emoji on gradient backgrounds (no photographs).
- **Animations**: Framer Motion scroll-triggered fade-ins, hover lift effects (`y: -6` / `y: -4`), scale on images.
- **Glassmorphism**: Used on stat cards in impact section (`backdrop-blur`, translucent backgrounds).

---

## 8. SEO & Performance

| Feature | Implementation |
|---------|----------------|
| Page titles | Unique `head()` meta on every route |
| Descriptions | Route-specific meta descriptions |
| OG tags | `og:title`, `og:description` on all routes |
| Sitemap | Dynamic `/sitemap.xml` route |
| Robots.txt | `public/robots.txt` |
| Lazy loading | `loading="lazy"` on all images |
| Responsive | Mobile-first Tailwind grid (sm:, lg: breakpoints) |

---

## 9. Constraints & Decisions

| Decision | Rationale |
|----------|-----------|
| **No backend / database** | Community platform designed for zero-cost deployment; localStorage persists data per-device |
| **No payment gateway** | Platform is a discovery/connectivity service only; buyers contact sellers directly (WhatsApp/phone) |
| **No auth system** | Seller "login" is just a localStorage pointer to their profile; no passwords needed for MVP |
| **Client-side only** | No server functions used; all data in localStorage or static seed files |
| **Image uploads as Base64** | Enables seller product images without needing file storage backend |
| **localStorage for sellers** | Simulates a database; acceptable for demo/MVP but would need real DB for production scale |

---

## 10. Future Enhancements (Not Implemented)

- Real backend database (Supabase / Lovable Cloud) for cross-device persistence
- OTP/phone authentication for sellers
- Admin panel for community managers
- Real-time chat between buyers and sellers
- Order tracking system
- Reviews and ratings
- Multi-language expansion beyond English/Telugu
- WhatsApp API integration for auto-messaging
