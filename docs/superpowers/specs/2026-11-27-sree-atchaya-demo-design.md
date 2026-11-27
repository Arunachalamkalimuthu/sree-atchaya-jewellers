# Sree Atchaya Jewellers — website + app clickable demo (design)

Date: 2026-11-27 · Status: draft for approval

## Intent and why

Sree Atchaya Jewellers (Coimbatore 641001; Instagram @sree_atchaya_jewellers, 274K followers, 610 posts,
listed as "Jewelry Wholesaler", tagline GOLD • SILVER • DIAMOND) sells almost entirely through Instagram reels,
phone calls and a WhatsApp group. They have no website or app.

We want to show them a **clickable demo of a website and a mobile app** where their customers can:

1. **order jewellery**, including pre-booking custom designs at today's rate, and
2. **join and pay into a gold savings scheme**.

The demo exists to win the client or get them aligned before anyone pays for a real build. It is the same
playbook as the Insta Gym demo (~/code/insta-gym-store).

## What we know about the business (from their Instagram, 2026-11-23..26)

- **Promises:** customised designs, 0% wastage (சேதாரம்) and 0% making charge on offers, plus 3% GST.
- **Daily "Today's Special Offer" posts:**
  - Pre-booked customised gold jewellery gets ₹540/gram off. Example: offer price ₹11,000/g against ₹11,540/g, with delivery timelines applying.
  - Gold coin offers are tiered by quantity (1–2 coins, above 4 coins).
  - Old gold is bought above market. On 25-11-2026 they paid ₹11,750/g for 22K old gold against a ₹11,420/g market selling price, and ₹10,000/g for 18K against ₹9,345/g.
- **Services:** cash for gold, gold release from bank or pawn loans, gold coin offers, silver models, a "30 days scheme", and custom jewels.
- **Scheme:** "AKD Digi Gold" (AKD seems to be a related brand). Anyone who joins with ₹10,000 between Nov 24 and Jan 14 enters a draw with 20 gold-prize winners.
- **Engagement:** a "guess the weight" contest for a 161 g mega necklace, in which 3 winners get a 1 g gold coin. They also post temple and festival content (Thirukovil kumbabishekam, Tiruchendur Soorasamharam).
- **Brand:**
  - Instagram logo: deep maroon with a gold peacock and temple "A".
  - Post templates: a green/gold Atchaya leaf mark, plus maroon, emerald and plum backgrounds with gold ornament borders.
  - Language: mostly Tamil.
- **Phones in posts:** +91 93630 29916 and +91 93449 29916. Bio: 93630 29916 (gold release), 93631 29916 (gold coin offers).

## Goals

- A demo the owner can open on his phone and tap through end to end:
  - browse, then order or pre-book, then pay (simulated), then track the order;
  - join a scheme, then pay an instalment or buy Digi Gold grams, then see the passbook.
- It must feel like *their* shop: maroon and gold, Tamil and English, their real offers and services, today's rates up front.
- One demo account, shared by the website and the app. A scheme joined on the website shows up in the app.

## Non-goals

- Real payments, real login, a backend or database, an admin panel, a live gold-rate feed, App Store or Play builds.

## Anti-goals (a failure even if it works)

- **Looking like a template or a "final year project".** The client rejected Insta Gym v1 for exactly this. The bar is
  premium Indian jeweller polish with its own identity, not a copy of Tanishq, GRT or SKTM.
- **Misleading real customers.** The demo carries their name and number on a public URL, so:
  - every page shows a slim "Design preview — not the official Sree Atchaya website" ribbon;
  - pages are `noindex` and `robots.txt` disallows all crawling;
  - order and payment screens say "demo — no order is placed".
- **Broken or machine-sounding Tamil.** Keep Tamil copy short and idiomatic, and match their own wording
  (சேதாரம், முன்பதிவு, தங்க நாணயம், இன்றைய சிறப்பு சலுகை).

## Approaches considered

| Approach | Trade-off | |
|---|---|---|
| **Clickable demo** (one Next.js build: website plus app screens in a phone frame, mock data, GitHub Pages) | ~1 day; nothing is real, but every flow is tappable | **Picked by founder** |
| Static design mockups on one page | Fastest; agrees the look, but the client can't *use* it | — |
| Real build (web + mobile app + backend + Razorpay/UPI + OTP + admin) | Weeks; needs client data, scheme terms and a payment account | Later, if the demo lands |

## The design

### Stack and hosting (builder's call, reusing Insta Gym)

- **Build:** Next.js 16 + React 19 + Tailwind 4, all client-side mock data in `lib/`, state in `localStorage`.
- **Hosting:** a static export to GitHub Pages from the public repo `Arunachalamkalimuthu/sree-atchaya-jewellers`, deployed by Actions on push to `main`. Copy Insta Gym's `next.config.ts` and `pages.yml` pattern, plus its static-export rules: `?id=` routes, `asset()` for `<img>`, `generateStaticParams` for catalogue pages.
- **Single source for numbers:** all business facts and demo numbers (rates, offers, phone numbers, address, scheme terms) live in one `lib/site.config.ts`, so real values are a one-file swap.

### Two surfaces, one codebase

- **Website** (`/`), responsive for desktop and mobile.
- **App** (`/app/...`):
  - On desktop it renders inside a phone frame, with a short "This is the mobile app" side panel and a QR code that opens it on a phone.
  - On a phone it is full-screen, with a bottom tab bar, and can be added to the home screen (web manifest and icons).
- **Language:** a Tamil/English toggle on both surfaces, saved in the browser. English is the default, so the founder can review in English and switch to Tamil for the client.

### Brand

- **Palette:** maroon (~#6E1517) and antique gold (~#C9A24A / #E8C77A), on an ivory (#FBF6EC) background. Emerald and plum accents echo their offer posters.
- **Type:** an elegant serif for display (e.g. Cormorant / Playfair), a clean sans for body text, and a Tamil-capable face (Noto Serif Tamil / Hind Madurai).
- **Logo:** a typographic "Sree Atchaya Jewellers" wordmark with a simple gold mark. We don't recreate their logo artwork, and swap in their real logo file when they send it.
- **Imagery:** AI-generated jewellery photography through the Canva MCP, about 25 images:
  - temple and bridal necklaces, haarams, bangles, chains, jhumkas, rings, gold coins and silver articles;
  - 3–4 lifestyle and showroom banners.
  - Use the Insta Gym Canva pipeline: one reference per design, export at full resolution, normalise backgrounds.

### Website pages

1. **Home**
   - Rate bar: 22K, 24K and 18K gold and silver per gram, dated today, with an "updated 10:00 AM" stamp.
   - Hero slider of today's offers: pre-book custom jewellery at ₹540/g off, gold coin offer, old-gold purchase rates.
   - Category grid and featured or new arrivals.
   - Gold Scheme call-out.
   - Services strip: custom designs, sell old gold, gold release from bank or pawn, gold coins.
   - Contests (weight-guess and lucky draw).
   - A reels-style "From our showroom" row.
   - Visit us (address, hours, map, call and WhatsApp).
   - A floating WhatsApp button on every page.
2. **Catalogue** (by category, filter by purity, weight and price).
3. **Product page**
   - Gallery, purity (22K 916 hallmark), weight and size.
   - **Live price breakdown:** weight × today's rate, wastage 0%, making charge, 3% GST, total.
   - Actions: "Buy now", "Pre-book at today's rate" (pay an advance to lock the rate) and "Ask on WhatsApp".
4. **Custom design order**
   - Upload a reference photo (preview only), then pick the type, purity, approximate weight and budget.
   - Shows the quoted price with the ₹540/g pre-book discount.
   - Pay an advance to confirm.
5. **Cart and checkout**
   - Store pickup (default) or insured delivery.
   - Phone OTP, simulated, with a "Fill code" button so nobody types a code.
   - Mock UPI, card or net-banking payment, then a confirmation with the order number.
6. **Gold Scheme** (two plans; terms are placeholders to confirm with the client)
   - **Monthly Savings Plan:** 11 monthly instalments from ₹1,000 to ₹25,000. The jeweller adds a bonus of one instalment. Redeem for jewellery at 0% wastage.
   - **Digi Gold:** buy gold by rupees or grams at today's rate, from ₹100, any time. Grams build up in the passbook and can be redeemed for jewellery or coins. This includes the ₹10,000 joining lucky-draw banner (Nov 24 – Jan 14).
   - The page offers a plan calculator and a join flow: KYC-lite form (name, phone, simulated OTP, nominee), choose an amount, pay the first instalment, then the passbook.
7. **Sell old gold / gold release**
   - An estimate calculator using their purchase rates (22K and 18K per gram).
   - A form to book a showroom appointment, or a release request (bank or pawn, loan amount).
8. **My account**: orders with status tracking, scheme passbooks, payment history, saved addresses.

### App screens (`/app`)

The app has five tabs:

- **Home:** greeting, today's rate card, my-scheme progress ring, today's offers carousel, quick actions (Pay instalment, Buy Digi Gold, Custom order, Sell gold).
- **Shop:** the same catalogue in a mobile layout, plus a product sheet with the price breakdown and Buy or Pre-book.
- **Scheme:** passbook (instalments paid and due, grams accumulated), Pay now, Buy grams, and a redeem flow.
- **Orders:** a custom-order tracker: Booked → Design approved → In making → Hallmarked → Ready for pickup. It includes a "design approval" step where the customer approves a sketch.
- **Profile:** language, KYC, nominee, addresses, "Talk to us".

The app also has a simulated rate-alert notification: "Gold dropped ₹40/g today".

### Demo data

- **Rates (demo values from their 25-11-2026 post):** 22K ₹11,420/g, 18K ₹9,345/g. 24K is derived (~₹12,460/g). Silver is a plausible placeholder. All of these live in `site.config.ts`.
- **Products:** about 24, with realistic weights (chains 8–20 g, bangles 16–40 g, haarams 40–160 g, coins 1/2/4/8 g).
- **Demo account:** "Use demo account" button. Already holds one active Monthly plan (7/11 paid), Digi Gold 2.35 g and one custom order "In making".

## Settled after builder review

**Founder decisions (2026-11-27):**

- **Contact buttons:** show their real numbers as text, but Call, WhatsApp and "Ask on WhatsApp" open a
  "Demo — not connected" sheet. No `tel:` or `wa.me` links anywhere in the demo.
- **Tamil:** translate the full UI. All copy lives in one file (`lib/i18n/ta.ts` alongside `en.ts`, the same keys) so the
  founder can review the Tamil in a single read before the client sees it.

**Builder's calls (correct me if wrong):**

- **Pricing**, one function in `lib/pricing.ts`:
  - Base rate = today's 22K rate from `site.config.ts`. The demo value is ₹11,540/g, matching their 26-11-2026 offer post (market moved since the 25th).
  - **Regular buy:** weight × rate, 0% wastage (their standing promise), a making charge per category (₹/g, e.g. chains ₹250, bangles ₹300, temple/bridal ₹450, coins ₹0), then 3% GST.
  - **Pre-book / custom offer:** rate − ₹540/g, 0% wastage, 0% making, 3% GST. It applies to custom orders and to catalogue "Pre-book at today's rate". Pre-book takes a 10% advance.
  - 18K is priced from the 18K rate the same way. Silver uses a flat making charge.
- **Images:** the Canva MCP pipeline as recorded in memory:
  - `create-design` with one reference per design, then `export-design`, then drop blank pages, then normalise to a white or ivory background with ffmpeg.
  - If Canva quota or quality fails, fall back to tasteful gradient placeholders so the image work never blocks the pages.
- **Repo and URL:** create the public repo `Arunachalamkalimuthu/sree-atchaya-jewellers` and enable Pages through Actions, as with Insta Gym.
  - The URL will be `https://arunachalamkalimuthu.github.io/sree-atchaya-jewellers/`.
  - `basePath`, the QR code and the manifest `start_url` come from that URL.

## Left to the builder

- Component structure, routing details, exact copy and animations, how the image pipeline gets batched.
- Using parallel subagents for independent pages (the founder prefers this).

## Open for the client (not blocking the demo)

- Real scheme names and terms (the "30 days scheme", AKD Digi Gold rules), making-charge policy, address and hours, logo files, and real photos.
- Retail vs wholesale audience. Their Instagram category is "Wholesaler", but the offers read as retail.
- Whether the eventual real app should be native or a PWA.
