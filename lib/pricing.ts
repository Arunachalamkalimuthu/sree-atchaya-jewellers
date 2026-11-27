import { RATES, MAKING_PER_GRAM, OFFER } from "./site.config";
import type { Product, Purity } from "./catalog";

export type PriceMode = "buy" | "prebook";

export interface PriceBreakdown {
  ratePerGram: number; discountPerGram: number; weightG: number; metalValue: number; wastage: number;
  making: number; stone: number; subtotal: number; gst: number; total: number; advance: number;
}

type Rates = typeof RATES;
const rateFor = (purity: Purity, r: Rates) =>
  purity === "22K" ? r.g22 : purity === "24K" ? r.g24 : purity === "18K" ? r.g18 : r.silver;

/** Pre-book: per-gram discount and no making charge, pay only the advance now. Rounded per line. */
export function priceBreakdown(
  p: Pick<Product, "purity" | "weightG" | "category" | "stoneValue">,
  mode: PriceMode,
  rates: Rates = RATES,
): PriceBreakdown {
  const prebook = mode === "prebook";
  const discountPerGram = prebook ? OFFER.prebookOffPerGram : 0;
  const ratePerGram = rateFor(p.purity, rates) - discountPerGram;
  const metalValue = Math.round(ratePerGram * p.weightG);
  const wastage = Math.round((metalValue * OFFER.wastagePct) / 100);
  const making = prebook ? 0 : Math.round(MAKING_PER_GRAM[p.category] * p.weightG);
  const stone = p.stoneValue ?? 0;
  const subtotal = metalValue + wastage + making + stone;
  const gst = Math.round((subtotal * OFFER.gstPct) / 100);
  const total = subtotal + gst;
  const advance = prebook ? Math.round((total * OFFER.prebookAdvancePct) / 100) : 0;
  return { ratePerGram, discountPerGram, weightG: p.weightG, metalValue, wastage, making, stone, subtotal, gst, total, advance };
}

export const formatINR = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const formatGrams = (g: number): string => `${g.toFixed(3)} g`;
