/** Catalogue query: the ?c= category plus purity, weight band and sort, kept in the URL. Pure, no React. */
import { CATEGORIES, PRODUCTS, type CategoryId, type Product, type Purity } from "@/lib/catalog";
import { priceBreakdown } from "@/lib/pricing";

export type Band = "light" | "mid" | "heavy";
export type Sort = "new" | "price" | "price-desc" | "weight";
export interface ShopQuery { cat?: CategoryId; purity?: Purity; band?: Band; sort: Sort }

export const PURITIES: Purity[] = ["22K", "24K", "18K", "silver"];
export const BANDS: Band[] = ["light", "mid", "heavy"];
export const SORTS: Sort[] = ["new", "price", "price-desc", "weight"];

/** Under 10 g, 10 to 30 g, 30 g and above. */
export const bandOf = (g: number): Band => (g < 10 ? "light" : g < 30 ? "mid" : "heavy");

const purityParam = (p: Purity) => p.toLowerCase();

export function parseQuery(sp: { get(name: string): string | null }): ShopQuery {
  const q: ShopQuery = { sort: "new" };
  const c = sp.get("c");
  if (c && CATEGORIES.some((x) => x.id === c)) q.cat = c as CategoryId;
  const p = sp.get("purity");
  const purity = PURITIES.find((x) => purityParam(x) === p);
  if (purity) q.purity = purity;
  const w = sp.get("w");
  if (w && (BANDS as string[]).includes(w)) q.band = w as Band;
  const s = sp.get("sort");
  if (s && (SORTS as string[]).includes(s)) q.sort = s as Sort;
  return q;
}

/** `c=…&purity=…&w=…&sort=…`, defaults left out. Use with `routes.shop()` + "?". */
export function toQueryString(q: ShopQuery): string {
  const sp = new URLSearchParams();
  if (q.cat) sp.set("c", q.cat);
  if (q.purity) sp.set("purity", purityParam(q.purity));
  if (q.band) sp.set("w", q.band);
  if (q.sort !== "new") sp.set("sort", q.sort);
  return sp.toString();
}

export const buyTotal = (p: Product) => priceBreakdown(p, "buy").total;

export function filterProducts(list: Product[], q: ShopQuery): Product[] {
  const out = list.filter(
    (p) => (!q.cat || p.category === q.cat) && (!q.purity || p.purity === q.purity) && (!q.band || bandOf(p.weightG) === q.band),
  );
  const order = new Map(list.map((p, i) => [p.slug, i]));
  const stable = (a: Product, b: Product) => order.get(a.slug)! - order.get(b.slug)!;
  const cmp: Record<Sort, (a: Product, b: Product) => number> = {
    new: (a, b) => Number(!!b.isNew) - Number(!!a.isNew) || stable(a, b),
    price: (a, b) => buyTotal(a) - buyTotal(b) || stable(a, b),
    "price-desc": (a, b) => buyTotal(b) - buyTotal(a) || stable(a, b),
    weight: (a, b) => a.weightG - b.weightG || stable(a, b),
  };
  return out.sort(cmp[q.sort]);
}

/** "You may also like": the same category first, then the nearest in price, `n` in all. */
export function related(p: Product, n = 4, list: Product[] = PRODUCTS): Product[] {
  const same = list.filter((x) => x.category === p.category && x.slug !== p.slug);
  const price = buyTotal(p);
  const rest = list
    .filter((x) => x.category !== p.category)
    .sort((a, b) => Math.abs(buyTotal(a) - price) - Math.abs(buyTotal(b) - price));
  return [...same, ...rest].slice(0, n);
}

/**
 * Niche tone by where the piece sits in the showroom: neck pieces hang on maroon velvet busts, the smaller
 * pieces sit on light trays. Breaks up a catalogue of identical maroon placeholders until photos land.
 */
export const nicheTone = (cat: CategoryId): "maroon" | "ivory" =>
  cat === "necklace" || cat === "haaram" || cat === "temple" || cat === "diamond" ? "maroon" : "ivory";

/** The rate a category is priced at, for the catalogue intro line. */
export const purityOfCategory = (cat?: CategoryId): Purity =>
  cat === "coin" ? "24K" : cat === "silver" ? "silver" : cat === "diamond" ? "18K" : "22K";
