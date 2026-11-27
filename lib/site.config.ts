import type { CategoryId } from "./catalog";

export const SITE = {
  name: "Sree Atchaya Jewellers",
  nameTa: "ஸ்ரீ அட்சயா ஜுவல்லர்ஸ்",
  tagline: "Gold • Silver • Diamond",
  ratesDate: "2026-11-26",
  ratesTime: "10:00 AM",
  address: { line: "Sree Atchaya Jewellers", city: "Coimbatore", state: "Tamil Nadu", pin: "641001" },
  hours: "10:00 AM – 9:00 PM, all days",
  phones: { main: "+91 93630 29916", alt: "+91 93449 29916", goldRelease: "+91 93630 29916", goldCoins: "+91 93631 29916" },
  instagram: "sree_atchaya_jewellers",
} as const;

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
