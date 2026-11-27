# Sree Atchaya Jewellers Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A clickable, bilingual (EN/தமிழ்) website + mobile-app demo for Sree Atchaya Jewellers where a customer can order or pre-book jewellery and join or pay into a gold scheme, published to GitHub Pages.

**Architecture:**
- **One Next.js 16 app.** It has website routes at `/` and app routes under `/app/`. The app routes render inside a phone frame on desktop and full-screen on mobile.
- **No backend.** All data is client-side: a pure reducer (`lib/demo-state.ts`) persisted to `localStorage` through a hook. The website and the app share that same state.
- **Business numbers live in one place**, `lib/site.config.ts`. All prices flow through one pure function in `lib/pricing.ts`.

**Tech Stack:**
- Next.js 16, React 19, TypeScript, Tailwind 4 (`@tailwindcss/turbopack`), and Vitest for `lib/`.
- `next/font/google`: Cormorant Garamond (display), Inter (body), Noto Serif Tamil (Tamil).
- Canva MCP for imagery, and `qrcode` (npm) for the app QR code.

**Spec:** `docs/superpowers/specs/2026-11-27-sree-atchaya-demo-design.md`

## Global Constraints

- **Repo and hosting:** public repo `Arunachalamkalimuthu/sree-atchaya-jewellers`. Pages is deployed by Actions on push to `main`. The URL is `https://arunachalamkalimuthu.github.io/sree-atchaya-jewellers/`, so `PAGES_BASE_PATH=/sree-atchaya-jewellers`.
- **Static export rules** (`GITHUB_PAGES=true`), copied from `~/code/insta-gym-store`:
  - records created in the browser are read with `?id=`;
  - catalogue pages use `generateStaticParams`, with data from modules that have no `"use client"`;
  - every `<img>` src goes through `asset()`;
  - every internal link goes through `lib/routes.ts`.
- **Preview safety:**
  - every page shows the ribbon "Design preview — not the official Sree Atchaya Jewellers website";
  - `<meta name="robots" content="noindex,nofollow">`, and `public/robots.txt` = `User-agent: *\nDisallow: /`;
  - order and payment confirmations say "Demo — no real order or payment was made".
- **Contact:** no `tel:` and no `wa.me` / `chat.whatsapp.com` links anywhere. Every Call or WhatsApp action opens `ContactSheet`, which shows the numbers as text and the line "Demo — not connected to the shop".
- **Brand colours:**
  - maroon `#6E1517`, maroon-deep `#4A0D0F`, gold `#C9A24A`, gold-light `#E8C77A`, ivory `#FBF6EC`;
  - accents: emerald `#0F4D3A`, plum `#5B1A47`.
- **Brand look:** premium, not template-like. The display serif carries prices and headings. Use thin gold rules, generous whitespace and real photography. No emoji in the UI.
- **Language:** every user-visible string comes from the i18n dictionaries (EN default, TA full). The Tamil uses the shop's own terms: சேதாரம், செய்கூலி, முன்பதிவு, தங்க நாணயம், இன்றைய சிறப்பு சலுகை, தங்க சேமிப்பு திட்டம்.
- **Money:** whole rupees, `Math.round` at the line level only. Display with Indian grouping, e.g. `₹1,21,437`.
- **No dates from the clock in rendered markup.** The "today" date is `SITE.ratesDate` (`"2026-11-26"`) to avoid hydration mismatch. Transaction timestamps created at runtime may use `Date`.
- **Commits:** no `Co-Authored-By` trailer, and never `--no-verify`.

## Review Focus

1. **Reloading a browser-created record:** `/order/?id=SAJ-10002` or `/app/orders/view/?id=…` must render from localStorage after a hard reload under the basePath. An unknown id shows "Order not found", not a crash. *(Task 7, Task 10)*
2. **Empty, corrupt or old-version localStorage** (`sa-demo` holding `"{bad json"` or `{version:0}`): the app loads with fresh initial state and doesn't throw. *(Task 2)*
3. **Tamil strings in the 360 px phone frame:** buttons and tab labels wrap or truncate cleanly and never overflow horizontally. Switching language mid-checkout keeps the cart and form values. *(Task 4, Task 10)*
4. **Cart money consistency:** the cart total equals the sum of the rounded line totals. The pre-book advance is 10% of the pre-book total, rounded once. Lakhs group correctly. *(Task 2)*
5. **basePath assets:** with `GITHUB_PAGES=true`, every image, font, the manifest and the icons resolve under `/sree-atchaya-jewellers/`. No root-relative `/images/...` slips through. *(Task 1, Task 11)*

---

## File Structure

```
lib/site.config.ts        business facts + demo numbers (only place numbers live)
lib/catalog.ts            categories + 24 products (no "use client")
lib/pricing.ts            priceBreakdown, formatINR, formatGrams
lib/scheme.ts             monthly plan summary, digi-gold maths
lib/demo-state.ts         DemoState types, initialState, demoSeed, reduce(), load/save
lib/use-demo.tsx          "use client" DemoProvider + useDemo() (useSyncExternalStore over localStorage)
lib/i18n/dict/*.ts        one file per area: { en: {...}, ta: {...} } with identical keys
lib/i18n/index.tsx        LanguageProvider, useT(), useLang()
lib/routes.ts, lib/asset.ts, lib/image-loader.ts
components/brand/*        Wordmark, DemoRibbon, GoldRule
components/ui/*           Button, Sheet, ContactSheet, OtpField, PaymentSheet, Price, ProductImage, LangToggle
components/site/*         Header, RateBar, Footer, WhatsAppFab, ProductCard, PriceBreakdownTable
components/app/*          PhoneFrame, TabBar, AppHeader, RateCard, ProgressRing, RateAlertToast
app/(site)/...            website routes
app/app/...               app routes
public/images/{products,banners,brand}/   Canva exports
```

---

### Task 1: Scaffold, Pages deploy, preview safety, theme

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `.github/workflows/pages.yml`, `public/robots.txt`, `app/layout.tsx`, `app/globals.css`, `lib/asset.ts`, `lib/image-loader.ts`, `lib/routes.ts`, `components/brand/DemoRibbon.tsx`, `README.md`, `.gitignore`
- Test: `lib/__tests__/asset.test.ts`

**Interfaces:**
- Produces:
  - `asset(path: string): string`, which prefixes `process.env.NEXT_PUBLIC_BASE_PATH`.
  - `routes` object:
    - `home()`, `shop(cat?: CategoryId)`, `product(slug)`, `custom()`, `sellGold()`;
    - `scheme()`, `schemeJoin(plan: "monthly"|"digi")`;
    - `cart()`, `checkout()`, `order(id)` → `/order/?id=…`, `account()`;
    - `app.home()`, `app.shop(cat?)`, `app.product(slug)`, `app.scheme()`, `app.orders()`, `app.order(id)` → `/app/orders/view/?id=…`, `app.profile()`.
  - Tailwind theme tokens: `maroon`, `maroon-deep`, `gold`, `gold-light`, `ivory`, `emerald`, `plum`; fonts `font-display`, `font-sans`, `font-tamil`.

- [ ] **Step 1:** `git init` in `~/code/sree-atchaya-jewellers` (docs/ already exists). Create the Next 16 app files mirroring `~/code/insta-gym-store` (`package.json` deps, `next.config.ts` with default basePath `/sree-atchaya-jewellers`, `pages.yml`), and add `vitest` + `qrcode` + `@types/qrcode`.
- [ ] **Step 2: Write the failing test** `asset.test.ts`:
  - with `NEXT_PUBLIC_BASE_PATH="/sree-atchaya-jewellers"`, `asset("/images/a.jpg")` returns `"/sree-atchaya-jewellers/images/a.jpg"`;
  - with it set to `""`, it returns `"/images/a.jpg"`.
- [ ] **Step 3:** Run `npx vitest run`. Expected: FAIL (module not found).
- [ ] **Step 4:** Implement `asset`, `image-loader`, `routes`.
- [ ] **Step 5:** `app/layout.tsx`:
  - fonts; `metadata.robots = { index:false, follow:false }`;
  - `<DemoRibbon/>` as a slim maroon-deep bar with gold text, fixed at the top on every page (EN text for now; Task 4 swaps it to i18n).
  - `globals.css` holds `@theme` tokens from Global Constraints, with ivory body bg.
- [ ] **Step 6:** Run `npx vitest run && GITHUB_PAGES=true npm run build`. Expected: tests pass; the build succeeds and `out/robots.txt` exists.
- [ ] **Step 7:** Commit `chore: scaffold Next 16 demo with Pages export and preview safety`.

### Task 2: Domain — config, catalog, pricing, scheme, demo state (TDD)

**Files:**
- Create: `lib/site.config.ts`, `lib/catalog.ts`, `lib/pricing.ts`, `lib/scheme.ts`, `lib/demo-state.ts`, `lib/use-demo.tsx`
- Test: `lib/__tests__/pricing.test.ts`, `lib/__tests__/scheme.test.ts`, `lib/__tests__/demo-state.test.ts`, `lib/__tests__/catalog.test.ts`

**Interfaces:**
- Produces, in `site.config.ts`:
  - `SITE`:
    - name `"Sree Atchaya Jewellers"`, nameTa `"ஸ்ரீ அட்சயா ஜுவல்லர்ஸ்"`, tagline `"Gold • Silver • Diamond"`, ratesDate `"2026-11-26"`, ratesTime `"10:00 AM"`;
    - address `{ line: "Sree Atchaya Jewellers", city: "Coimbatore", state: "Tamil Nadu", pin: "641001" }`, hours `"10:00 AM – 9:00 PM, all days"`;
    - phones `{ main: "+91 93630 29916", alt: "+91 93449 29916", goldRelease: "+91 93630 29916", goldCoins: "+91 93631 29916" }`, instagram `"sree_atchaya_jewellers"`.
  - `RATES`: `{ g22: 11540, g24: 12590, g18: 9440, silver: 190 }` (₹/g).
  - `PURCHASE_RATES`: `{ g22: 11750, g18: 10000 }` and `MARKET_SELL_25NOV`: `{ g22: 11420, g18: 9345 }`.
  - `OFFER`: `{ prebookOffPerGram: 540, prebookAdvancePct: 10, gstPct: 3, wastagePct: 0 }`.
  - `MAKING_PER_GRAM: Record<CategoryId, number>`: `{ necklace: 400, haaram: 450, temple: 450, bangle: 300, chain: 250, earring: 350, ring: 300, coin: 0, silver: 15, diamond: 500 }`.
  - `SCHEME`:
    - `{ months: 11, bonusInstalments: 1, minMonthly: 1000, maxMonthly: 25000, stepMonthly: 500, digiMinRupees: 100 }`;
    - `luckyDraw: { joinAmount: 10000, from: "2026-11-24", to: "2027-01-14", winners: 20 }`.
  - `CONTEST`: `{ necklaceGrams: 161, winners: 3, prize: "1 g gold coin" }`.
- Produces, in `catalog.ts`:
  - `type CategoryId = "necklace"|"haaram"|"temple"|"bangle"|"chain"|"earring"|"ring"|"coin"|"silver"|"diamond"`, and `CATEGORIES: {id, en, ta}[]`;
  - `type Purity = "22K"|"18K"|"24K"|"silver"`;
  - `interface Product { slug: string; name: {en:string; ta:string}; category: CategoryId; purity: Purity; weightG: number; stoneValue?: number; sizes?: string[]; image: string /* "/images/products/<slug>.jpg" */; isNew?: boolean; prebookable: boolean }`;
  - `PRODUCTS: Product[]` (24, distributed: necklace 3, haaram 2, temple 3, bangle 3, chain 3, earring 3, ring 2, coin 2 (24K, 4 g and 8 g), silver 2, diamond 1);
  - `getProduct(slug): Product | undefined`, `byCategory(cat): Product[]`.
- Produces, in `pricing.ts`:
  - `type PriceMode = "buy"|"prebook"`;
  - `interface PriceBreakdown { ratePerGram; discountPerGram; weightG; metalValue; wastage; making; stone; subtotal; gst; total; advance }` (all numbers);
  - `priceBreakdown(p: Pick<Product,"purity"|"weightG"|"category"|"stoneValue">, mode: PriceMode, rates = RATES): PriceBreakdown`;
  - `formatINR(n: number): string`, `formatGrams(g: number): string` (`"2.350 g"`).
- Produces, in `scheme.ts`:
  - `interface Payment { date: string; amount: number }`, `interface MonthlyPlan { id: string; monthly: number; startedOn: string; payments: Payment[] }`;
  - `interface DigiTxn { date: string; rupees: number; grams: number; rate: number }`, `interface DigiGold { txns: DigiTxn[] }`;
  - `planSummary(plan: MonthlyPlan): { paidCount; dueCount; paidAmount; bonus; maturityValue; nextDueDate: string|null; complete: boolean }`;
  - `isValidMonthly(n: number): boolean`;
  - `rupeesToGrams(rupees: number, rate = RATES.g24): number` (floored to 4 dp), `digiBalance(d: DigiGold): number`.
- Produces, in `demo-state.ts`:
  - `type OrderStatus = "booked"|"design_approved"|"making"|"hallmarked"|"ready"`, and `ORDER_STEPS: OrderStatus[]` in that order;
  - `interface CartLine { id; slug; mode: PriceMode; size?: string; qty: number }`;
  - `interface CustomSpec { type: CategoryId; purity: Purity; approxWeightG: number; budget?: number; notes?: string; refImage?: string /* dataURL, preview only */ }`;
  - `interface Order { id; kind: "catalog"|"custom"; lines: CartLine[]; custom?: CustomSpec; fulfilment: "pickup"|"delivery"; total; advancePaid; payMethod: "upi"|"card"|"netbanking"; status: OrderStatus; createdAt: string }`;
  - `interface Appointment { id; kind: "sell"|"release"; name; phone; date; grams?; purity?; bank?; loanAmount? }`;
  - `interface DemoState { version: 1; user: {name:string; phone:string} | null; cart: CartLine[]; orders: Order[]; plans: MonthlyPlan[]; digi: DigiGold; appointments: Appointment[]; nextId: number }`;
  - `type Action =`
    - `{type:"signInDemo"}` | `{type:"signIn"; name; phone}` | `{type:"signOut"}` | `{type:"reset"}`;
    - `{type:"addToCart"; line: Omit<CartLine,"id">}` | `{type:"setQty"; id; qty}` | `{type:"removeLine"; id}`;
    - `{type:"placeOrder"; order: Omit<Order,"id"|"status"|"createdAt">}`;
    - `{type:"joinPlan"; monthly}` | `{type:"payInstalment"; planId}` | `{type:"buyDigi"; rupees}` | `{type:"book"; appt: Omit<Appointment,"id">}`;
  - `initialState`, `demoSeed: DemoState`, `reduce(s: DemoState, a: Action): DemoState`;
  - `load(raw: string|null): DemoState`;
  - `cartTotals(cart: CartLine[]): { total: number; advance: number; payNow: number }`. Buy lines pay in full; pre-book lines pay the advance only.
- Produces, in `use-demo.tsx`:
  - `DemoProvider` and `useDemo(): { state: DemoState; dispatch(a: Action): void; lastOrderId: string|null }`;
  - the localStorage key is `"sa-demo"`.

- [ ] **Step 1: Write failing tests** `pricing.test.ts`:
  - `priceBreakdown({purity:"22K",weightG:10,category:"chain"},"buy")`:
    - metalValue 115400, making 2500, wastage 0, subtotal 117900, gst 3537, total 121437, advance 0.
  - same with `"prebook"`:
    - ratePerGram 11000, discountPerGram 540, metalValue 110000, making 0, gst 3300, total 113300, advance 11330.
  - 18K ring 4 g buy: metalValue 37760, making 1200, total `Math.round((37760+1200)*1.03)` = 40129.
  - diamond: `stoneValue: 45000` is added before GST.
  - formatting: `formatINR(121437) === "₹1,21,437"`, `formatINR(999) === "₹999"`, `formatINR(10000000) === "₹1,00,00,000"`, `formatGrams(2.35) === "2.350 g"`.
- [ ] **Step 2: Write failing tests** `scheme.test.ts`:
  - `isValidMonthly`: 1000 true, 1250 false, 25500 false, 500 false.
  - A plan with monthly 5000 and 7 payments has paidCount 7, dueCount 4, paidAmount 35000, bonus 5000, maturityValue 60000, complete false.
  - The `nextDueDate` is one month after the last payment.
  - `rupeesToGrams(1000, 12590) === 0.0794`. `digiBalance` sums the grams.
- [ ] **Step 3: Write failing tests** `demo-state.test.ts`:
  - `load(null)`, `load("{bad")` and `load('{"version":0}')` all deep-equal `initialState`.
  - `signInDemo` yields state with the user set, 1 plan (monthly 5000, 7 payments), digi balance 2.35 and 1 custom order with status `"making"`.
  - `placeOrder`:
    - returns an order id `SAJ-10001` and then `SAJ-10002` (from `nextId`, starting at 10001);
    - clears the cart for `kind:"catalog"`;
    - sets status `"booked"`.
  - `payInstalment` appends one payment, and is a no-op when the plan is complete.
  - `buyDigi` with 50 is rejected (state unchanged); with 1000 it adds a txn.
  - `cartTotals`: for a buy line (10 g chain) plus a pre-book line (10 g chain):
    - total 121437 + 113300 = 234737;
    - advance 11330;
    - payNow 121437 + 11330 = 132767.
- [ ] **Step 4:** `catalog.test.ts`:
  - 24 products with unique slugs;
  - every category in `CATEGORIES` has at least 1 product;
  - `silver` and `coin` products have `prebookable === false`.
- [ ] **Step 5:** Run `npx vitest run`. Expected: FAIL.
- [ ] **Step 6:** Implement the five lib files.
  - `use-demo.tsx` uses `useSyncExternalStore` with a server snapshot of `initialState`.
  - Write to localStorage on every dispatch, and listen to the `storage` event so a website tab and an app tab stay in sync.
- [ ] **Step 7:** Run `npx vitest run`. Expected: all pass.
- [ ] **Step 8:** Commit `feat: domain model — config, catalog, pricing, scheme, demo state`.

### Task 3: Canva imagery (runs in parallel with Tasks 4–10)

**Files:**
- Create: `public/images/products/<slug>.jpg` (24, 1200×1200), `public/images/banners/{hero-bridal,hero-prebook,hero-coins,hero-oldgold,showroom,scheme}.jpg` (1920×900 or wider), `public/images/brand/{mark.png,icon-192.png,icon-512.png,og.jpg}`, `public/images/CREDITS.md` (Canva design ids)

**Interfaces:**
- Consumes: the `PRODUCTS` slugs and names from `lib/catalog.ts`.
- Produces: files at exactly those paths. `ProductImage` (Task 4) falls back to a gradient if a file is missing.

- [ ] **Step 1:** Load the Canva tools and generate one test product shot. This verifies auth and quota, and checks the style:
  - photoreal studio jewellery photography, 22K yellow-gold South Indian;
  - on a warm ivory or deep maroon velvet bust;
  - soft key light, no text, no watermark.
- [ ] **Step 2:** Use the pipeline from memory for each image:
  - `create-design` with ONE reference per design, then `export-design` as PNG/JPG at full resolution;
  - drop blank pages;
  - normalise with ffmpeg: product tiles square, crop to 1200×1200, `colorlevels` so backgrounds match the ivory or maroon set;
  - banners are a lifestyle shot (a bride in a temple necklace, gold coins on silk, a showroom counter) with space on the left for overlay text, and no baked-in text.
- [ ] **Step 3:** Brand mark: a simple gold peacock-feather/leaf monogram "SA" on transparent, plus app icons 192/512 on maroon.
- [ ] **Step 4:** Verify with `ls public/images/products | wc -l` (expected 24) and view 4 random images to check they're on-style.
- [ ] **Step 5:** Commit `feat: Canva product, banner and brand imagery`.

### Task 4: Design system, i18n and site shell

**Files:**
- Create: `lib/i18n/index.tsx`, `lib/i18n/dict/common.ts`, `components/brand/{Wordmark,GoldRule}.tsx`, `components/ui/{Button,Sheet,ContactSheet,OtpField,PaymentSheet,Price,ProductImage,LangToggle}.tsx`, `components/site/{Header,RateBar,Footer,WhatsAppFab,ProductCard,PriceBreakdownTable}.tsx`, `app/(site)/layout.tsx`
- Modify: `app/layout.tsx` (wrap in `DemoProvider` + `LanguageProvider`; ribbon text from i18n)
- Test: `lib/__tests__/i18n.test.ts`

**Interfaces:**
- Consumes: Task 1 tokens and `routes`; Task 2 `SITE`, `RATES`, `priceBreakdown`, `formatINR`, `useDemo`.
- Produces:
  - **i18n:**
    - `type Lang = "en"|"ta"`, `useLang(): [Lang, (l: Lang)=>void]` (persisted in localStorage `"sa-lang"`, sets `<html lang>`);
    - `useT<D extends Dict>(dict: D): (key: keyof D["en"]) => string`;
    - each dict file exports `const X = { en: {...}, ta: {...} } satisfies Dict`.
  - **Overlays:** `<Sheet open onClose title>` (bottom sheet on mobile, centred dialog on desktop) and `<ContactSheet open onClose topic?: "general"|"goldRelease"|"goldCoins">`.
  - **Checkout pieces:**
    - `<OtpField phone onVerified>` shows a "Fill code" button that fills `"482916"`, plus Verify.
    - `<PaymentSheet open amount onPaid(method) onClose>` offers UPI, Card or NetBanking, then a 1.2 s "Processing…" step, then calls `onPaid`.
  - **Display:** `<Price value size?>`, `<ProductImage src alt className>` (gradient + mark fallback), `<RateBar compact?>`, `<ProductCard product mode?>`, `<PriceBreakdownTable breakdown mode>`.
  - **Primitives:** `<Button variant="gold"|"maroon"|"ghost" href? onClick?>`.

- [ ] **Step 1: Write the failing test** `i18n.test.ts`:
  - for every module in `lib/i18n/dict/*.ts`, `Object.keys(d.ta).sort()` equals `Object.keys(d.en).sort()`;
  - no value is an empty string.
  - Use `import.meta.glob` (vitest) so dictionaries added later are covered automatically.
- [ ] **Step 2:** Run `npx vitest run lib/__tests__/i18n.test.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement the i18n layer and the shell components.
  - **Header:** wordmark, nav (Jewellery, Gold Scheme, Custom Design, Sell Gold, Visit), lang toggle, account and cart icons. On mobile it becomes a slide-in menu.
  - **RateBar:** maroon-deep bar above the header showing "Today's rate · 26 Nov 2026 · 10:00 AM", then 22K, 24K, 18K and Silver per gram.
  - **Footer:** address, hours, phones (as text), Instagram handle as text, and the demo disclaimer.
  - **WhatsAppFab:** opens ContactSheet.
  - All copy goes in `dict/common.ts` in EN and TA.
- [ ] **Step 4:** Run `npx vitest run && npm run build`. Expected: pass.
- [ ] **Step 5:** Run `npm run dev`, open `/` at 1440 px and 375 px, toggle Tamil, and screenshot. Expected:
  - nothing overflows;
  - ContactSheet opens from the FAB and has no `tel:` link (check with `grep -r "tel:\|wa.me\|chat.whatsapp" app components` returning nothing).
- [ ] **Step 6:** Commit `feat: design system, bilingual shell, contact/OTP/payment sheets`.

> **Tasks 5–10 run in parallel after Task 4.** Each owns its own routes and its own `lib/i18n/dict/<area>.ts`. None edits shared components. If one needs a shared change, it reports back instead of editing.

### Task 5: Home page

**Files:** Create `app/(site)/page.tsx`, `components/home/{HeroSlider,OfferStrip,CategoryGrid,SchemeCallout,ServicesStrip,ContestCards,ShowroomReels,VisitUs}.tsx`, `lib/i18n/dict/home.ts`

**Interfaces:** Consumes `PRODUCTS`, `CATEGORIES`, `OFFER`, `PURCHASE_RATES`, `MARKET_SELL_25NOV`, `SCHEME.luckyDraw`, `CONTEST`, `routes`, the shell components and the banners from Task 3.

- [ ] **Step 1:** Build the sections in the spec order.
  - **HeroSlider:** 3 slides, auto-advancing every 6 s and pausable:
    - pre-book ₹540/g off (₹11,540 → ₹11,000 /g, 0% wastage, 0% making, 3% GST, "Delivery timelines apply");
    - gold coin offers;
    - old-gold purchase rates (22K ₹11,750 vs ₹11,420 market; 18K ₹10,000 vs ₹9,345).
  - **Other sections:**
    - Category grid of 10.
    - "New arrivals" row of 8 `ProductCard`s.
    - SchemeCallout (monthly and Digi Gold), with the lucky-draw strip "Join with ₹10,000 · 24 Nov – 14 Jan · 20 gold prizes".
    - ServicesStrip: custom designs, sell old gold, gold release from bank or pawn, gold coins.
    - ContestCards: weight-guess for the 161 g necklace, and the lucky draw.
    - ShowroomReels: 4 vertical poster cards from the banners, with a play glyph that opens a "Watch on Instagram" sheet (text only).
    - VisitUs: an address card with an OpenStreetMap static embed via `<iframe>` of osm.org for Coimbatore 641001, plus a ContactSheet trigger.
- [ ] **Step 2:** Run `npx vitest run && npm run build`. Expected: pass.
- [ ] **Step 3:** Screenshot at 1440 and 375 in EN and TA. Check it against the Anti-goal "template look": the hero is full-bleed photography, prices are in the display serif, and gold rules separate sections.
- [ ] **Step 4:** Commit `feat: home page`.

### Task 6: Catalogue and product page

**Files:** Create `app/(site)/shop/page.tsx`, `app/(site)/product/[slug]/page.tsx` (`generateStaticParams` from `PRODUCTS`), `components/shop/{Filters,ProductGallery,BuyBox}.tsx`, `lib/i18n/dict/shop.ts`

**Interfaces:** Consumes `PRODUCTS`, `byCategory`, `getProduct`, `priceBreakdown`, `useDemo` (dispatch `addToCart`), `PriceBreakdownTable` and `ContactSheet`.

- [ ] **Step 1:** Shop page:
  - category from `?c=`, filters for purity, weight band (<10 g, 10–30 g, 30 g+) and sort (price, weight, new);
  - the URL updates via `router.replace` (no dynamic route).
- [ ] **Step 2:** Product page:
  - gallery (main image + 3 zoom-crops via CSS `object-position`) and a "BIS 916 Hallmarked" badge for 22K;
  - a size select when `sizes`;
  - a Buy / Pre-book toggle, with Pre-book shown only when `prebookable`, and the breakdown table updating live;
  - CTAs: Buy now / Pre-book (pay 10% advance) adds to cart and goes to the cart; Ask on WhatsApp opens ContactSheet.
  - "You may also like" (same category).
- [ ] **Step 3:** Run `GITHUB_PAGES=true npm run build`. Expected: `out/product/<slug>/index.html` exists for all 24.
- [ ] **Step 4:** In the browser, the 10 g chain breakdown shows `₹1,21,437` for Buy and `₹1,13,300` with a `₹11,330` advance for Pre-book.
- [ ] **Step 5:** Commit `feat: catalogue and product pages with live price breakdown`.

### Task 7: Cart, checkout, order confirmation, account

**Files:** Create `app/(site)/cart/page.tsx`, `app/(site)/checkout/page.tsx`, `app/(site)/order/page.tsx`, `app/(site)/account/page.tsx`, `components/orders/OrderTracker.tsx` (shared with Task 10, which consumes it), `lib/i18n/dict/checkout.ts`, `lib/i18n/dict/account.ts`

**Interfaces:**
- Consumes `cartTotals`, `useDemo`, `OtpField`, `PaymentSheet`, `routes.order`.
- Produces `<OrderTracker status: OrderStatus>`, a horizontal stepper on the website and vertical when `vertical`.

- [ ] **Step 1:** Cart page: lines with a mode badge (Buy / Pre-book), qty and remove; totals show the order value, the advance due now on pre-book lines and the pay-now amount; and the empty state.
- [ ] **Step 2:** Checkout page:
  1. Sign in: "Use demo account", or name + phone + `OtpField`.
  2. Fulfilment: Store pickup at Coimbatore (default) or Insured delivery (address fields).
  3. Pay `payNow` through `PaymentSheet`.
  - Then dispatch `placeOrder` and navigate to `routes.order(id)`.
- [ ] **Step 3:** Order page: reads `?id=` from `useSearchParams` inside `<Suspense>`, and shows the order, the tracker and the demo disclaimer. An unknown id shows "Order not found" with a link to the shop.
- [ ] **Step 4:** Account page: profile, orders list linking to `routes.order`, scheme passbook summaries linking to `/scheme/`, appointments, and Sign out / Reset demo.
- [ ] **Step 5:** Verify with `GITHUB_PAGES=true npm run build && npx serve out`:
  - place an order;
  - hard-reload `/sree-atchaya-jewellers/order/?id=SAJ-10002`;
  - expected: the order renders. `?id=NOPE` shows Order not found.
- [ ] **Step 6:** Commit `feat: cart, checkout with OTP and payment, order tracking, account`.

### Task 8: Custom design order and Sell gold / Gold release

**Files:** Create `app/(site)/custom-order/page.tsx`, `app/(site)/sell-gold/page.tsx`, `lib/i18n/dict/custom.ts`, `lib/i18n/dict/sell.ts`

**Interfaces:** Consumes `priceBreakdown` (in `"prebook"` mode, with `{purity, weightG: approxWeightG, category: type}`), `placeOrder` with `kind:"custom"`, `OtpField`, `PaymentSheet`, `PURCHASE_RATES`, and `book`.

- [ ] **Step 1:** Custom order is a 4-step wizard:
  1. reference photo (file input, kept as a dataURL preview only, max 2 MB, otherwise a friendly error);
  2. type, purity, approximate weight slider (2–200 g), budget and notes;
  3. a quote card showing the pre-book breakdown, "₹540/g off applied" and the advance;
  4. verify the phone, then pay the advance, then the order page.
- [ ] **Step 2:** Sell gold page:
  - Tabs: Sell old gold / Release pledged gold.
  - **Sell:** an estimate calculator (grams × purity rate from `PURCHASE_RATES`) next to the market rate, plus the "We pay more" difference.
  - **Release:** bank or pawn, loan amount and gold weight, with the estimated surplus = grams × 22K purchase rate − loan.
  - Both end in an appointment booking form, then `book`, then a confirmation card.
- [ ] **Step 3:** Run `npm run build`. In the browser, 10 g 22K sell gives `₹1,17,500`; release with 20 g and a ₹1,50,000 loan gives a surplus of `₹85,000`.
- [ ] **Step 4:** Commit `feat: custom design pre-booking and sell/release gold`.

### Task 9: Gold Scheme

**Files:** Create `app/(site)/scheme/page.tsx`, `app/(site)/scheme/join/page.tsx`, `components/scheme/{PlanCalculator,Passbook,DigiBuy}.tsx` (Passbook and DigiBuy are reused by Task 10), `lib/i18n/dict/scheme.ts`

**Interfaces:**
- Consumes `SCHEME`, `planSummary`, `isValidMonthly`, `rupeesToGrams`, `digiBalance`, `joinPlan`, `payInstalment`, `buyDigi`, `OtpField`, `PaymentSheet`.
- Produces `<Passbook plan>`, `<DigiBuy onDone?>` (rupees or grams input, live conversion at `RATES.g24`) and `<PlanCalculator>`.

- [ ] **Step 1:** Scheme landing:
  - two plan cards (Monthly Savings: 11 instalments + 1 bonus, redeem at 0% wastage; Digi Gold: from ₹100, 24K);
  - the calculator (slider ₹1,000–₹25,000 in steps of ₹500, showing paid, bonus and maturity value);
  - the lucky-draw banner, an FAQ (5 Q&As, EN and TA) and "Terms to be confirmed with Sree Atchaya" fine print;
  - when signed in, "My schemes" with the Passbook.
- [ ] **Step 2:** Join flow `?plan=monthly|digi`: KYC-lite (name, phone, OTP, nominee name and relation), then the amount, then `PaymentSheet`, then `joinPlan` / `buyDigi`, then a success screen with the passbook.
- [ ] **Step 3:** Run `npm run build`. In the browser: with monthly 5000, the calculator shows paid ₹55,000, bonus ₹5,000, maturity ₹60,000; the demo account's passbook shows 7/11; "Pay instalment" makes it 8/11.
- [ ] **Step 4:** Commit `feat: gold savings scheme — plans, calculator, join, passbook, digi gold`.

### Task 10: Mobile app (`/app`)

**Files:** Create `app/app/layout.tsx`, `app/app/page.tsx`, `app/app/shop/page.tsx`, `app/app/product/[slug]/page.tsx`, `app/app/scheme/page.tsx`, `app/app/orders/page.tsx`, `app/app/orders/view/page.tsx`, `app/app/profile/page.tsx`, `components/app/{PhoneFrame,TabBar,AppHeader,RateCard,ProgressRing,RateAlertToast,QrPanel}.tsx`, `public/manifest.webmanifest`, `lib/i18n/dict/app.ts`

**Interfaces:**
- Consumes everything above, plus `Passbook`, `DigiBuy` (Task 9), `OrderTracker` (Task 7) and `BuyBox` (Task 6).
- If Task 6, 7 or 9 isn't merged yet, build against the Interfaces names and integrate last.

- [ ] **Step 1:** Layout:
  - at ≥ 1024 px, a centred 390×844 phone frame (rounded bezel, status bar "9:41") next to `QrPanel` (the QR for the absolute app URL, built with the `qrcode` lib, plus the "This is the mobile app" copy);
  - below 1024 px, full-screen;
  - a bottom TabBar (Home, Shop, Scheme, Orders, Profile) with gold active states;
  - the site ribbon is still shown.
- [ ] **Step 2:** Screens per the spec:
  - Home: greeting, RateCard, a ProgressRing of the plan's paidCount/11, the offers carousel and 4 quick actions;
  - Shop + product, in a mobile layout reusing pricing;
  - Scheme: Passbook, Pay now, DigiBuy, Redeem (a sheet saying "Visit showroom to redeem");
  - Orders list and `view?id=` with a vertical OrderTracker. When status is `design_approved` or `booked` for a custom order, show the "Approve design" sketch card.
  - Profile: language, KYC, nominee, addresses, Talk to us (ContactSheet).
- [ ] **Step 3:** `RateAlertToast` appears 3 s after the first app load in a session: "Gold dropped ₹40/g today — 22K ₹11,540". Dismissible; tapping it goes to the Scheme tab.
- [ ] **Step 4:** Manifest: name, `short_name: "Atchaya"`, `start_url` and `scope` = `<basePath>/app/`, theme `#6E1517`, and icons from Task 3. Linked from `app/app/layout.tsx` metadata.
- [ ] **Step 5:** Run `GITHUB_PAGES=true npm run build`, then check in the browser at 1440 (frame + QR) and 375 (full-screen) in EN and TA:
  - the tab labels in Tamil don't overflow at 360 px;
  - a scheme joined on `/scheme/join` shows up in `/app/scheme/`.
- [ ] **Step 6:** Commit `feat: mobile app prototype with phone frame, tabs, passbook and order tracker`.

### Task 11: Tamil pass, polish, publish

**Files:** Modify any page or component for polish. Create `docs/TAMIL-REVIEW.md` (the list of every TA string grouped by area, for the founder's review).

- [ ] **Step 1:**
  - Run `npx vitest run` (expected: all pass) and `npm run lint` (expected: 0 errors).
  - Check `grep -rn "tel:\|wa.me\|chat.whatsapp" app components lib` returns nothing.
  - Check `grep -rn 'src="/' app components` returns nothing (every image goes through `asset()`).
- [ ] **Step 2:** Generate `docs/TAMIL-REVIEW.md` from the dictionaries with a small node script (`scripts/tamil-review.mjs`). Each row has the key, EN and TA.
- [ ] **Step 3:** Visual pass:
  - screenshot each route at 1440 and 375 in EN and TA;
  - fix spacing and type inconsistencies;
  - check the anti-goal: would a jeweller believe this is a premium brand's site?
- [ ] **Step 4:** Publish:
  - `gh repo create Arunachalamkalimuthu/sree-atchaya-jewellers --public --source . --push`;
  - `gh api -X POST repos/Arunachalamkalimuthu/sree-atchaya-jewellers/pages -f build_type=workflow`;
  - watch `gh run watch`. Expected: the deploy job succeeds.
- [ ] **Step 5:** Open `https://arunachalamkalimuthu.github.io/sree-atchaya-jewellers/` and `/app/`, and walk both flows (order and scheme) end to end. Confirm the images and fonts load (no 404s in the network panel).
- [ ] **Step 6:** Write memory `sree-atchaya-jewellers.md` (repo, preview URL, decisions, pending client inputs) and add it to the MEMORY.md index.
