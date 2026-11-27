import type { CategoryId } from "./catalog";

export const SITE = {
  name: "Sree Atchaya Jewellers",
  nameTa: "ஸ்ரீ அட்சயா ஜுவல்லர்ஸ்",
  tagline: "Gold • Silver • Diamond",
  ratesDate: "2026-11-26",
  ratesTime: "10:00 AM",
  /** From the shop's own Facebook page. Rendered through common.footerAddress (EN/TA) with these values. */
  address: { line1: "No-456, First floor, Shop No: F2", line2: "Swarnalaya Complex", city: "Coimbatore", state: "Tamil Nadu", pin: "641001" },
  /** Placeholder: the shop has not published its hours. */
  hours: "10:00 AM – 9:00 PM, all days",
  /**
   * Shown as text only (no phone-dialler or WhatsApp links). `enquiry` is the main enquiry number (also on the shop's
   * gold-rate posts) and is listed first; `main` is the showroom and gold-release line.
   */
  phones: {
    enquiry: "+91 93633 95916",
    main: "+91 93630 29916",
    goldRelease: "+91 93630 29916",
    alt: "+91 93449 29916",
    goldCoins: "+91 93631 29916",
  },
  /** Text only, never an email link. */
  email: "sreeatchayaajewellers@gmail.com",
  /** Text handles only, never links. Follower counts as on the pages. */
  social: {
    instagram: "sree_atchaya_jewellers",
    instagramFollowers: "274K",
    facebook: "ஸ்ரீ அட்சயா ஜூவல்லர்ஸ்",
    facebookFollowers: "176K",
  },
  /** Facebook page categories. */
  categories: ["Gold jewellery", "Pawn shop"],
  /** Towns the shop serves, in English; `serviceAreaTa` is the same list in Tamil, same order. */
  serviceArea: ["Coimbatore (including Race Course)", "Tiruppur", "Erode", "Salem", "Namakkal", "Tiruchengode", "Karur", "Dindigul", "Palani", "Dharmapuri"],
  serviceAreaTa: ["கோயம்புத்தூர் (ரேஸ் கோர்ஸ் உட்பட)", "திருப்பூர்", "ஈரோடு", "சேலம்", "நாமக்கல்", "திருச்செங்கோடு", "கரூர்", "திண்டுக்கல்", "பழனி", "தர்மபுரி"],
} as const;

/** Values for common.footerAddress: `t("footerAddress", ADDRESS_VARS)`. */
export const ADDRESS_VARS = { line1: SITE.address.line1, line2: SITE.address.line2, pin: SITE.address.pin };

/** Rupees per gram. */
export const RATES = { g22: 11540, g24: 12590, g18: 9440, silver: 190 };
export const PURCHASE_RATES = { g22: 11750, g18: 10000 };
export const MARKET_SELL_25NOV = { g22: 11420, g18: 9345 };

export const OFFER = { prebookOffPerGram: 540, prebookAdvancePct: 10, gstPct: 3, wastagePct: 0 };

export const MAKING_PER_GRAM: Record<CategoryId, number> = {
  necklace: 400, haaram: 450, temple: 450, bangle: 300, chain: 250, earring: 350, ring: 300, coin: 0, silver: 15, diamond: 500,
};

export const SCHEME = {
  months: 11,
  bonusInstalments: 1,
  minMonthly: 1000,
  maxMonthly: 25000,
  stepMonthly: 500,
  digiMinRupees: 100,
  luckyDraw: { joinAmount: 10000, from: "2026-11-24", to: "2027-01-14", winners: 20 },
};

export const CONTEST = { necklaceGrams: 161, winners: 3, prize: "1 g gold coin" };
