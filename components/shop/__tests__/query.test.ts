import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/lib/catalog";
import { bandOf, filterProducts, parseQuery, related, toQueryString } from "../query";

const sp = (s: string) => new URLSearchParams(s);

describe("shop query", () => {
  it("parses ?c= and the filters, ignoring junk", () => {
    expect(parseQuery(sp("c=chain&purity=22k&w=mid&sort=price"))).toEqual({ cat: "chain", purity: "22K", band: "mid", sort: "price" });
    expect(parseQuery(sp("c=nope&purity=9k&w=x&sort=zzz"))).toEqual({ sort: "new" });
  });

  it("round-trips through the query string and leaves defaults out", () => {
    expect(toQueryString({ sort: "new" })).toBe("");
    const q = { cat: "bangle", purity: "22K", band: "heavy", sort: "weight" } as const;
    expect(toQueryString(q)).toBe("c=bangle&purity=22k&w=heavy&sort=weight");
    expect(parseQuery(sp(toQueryString(q)))).toEqual(q);
  });

  it("bands weights at 10 g and 30 g", () => {
    expect([bandOf(9), bandOf(10), bandOf(29), bandOf(30)]).toEqual(["light", "mid", "mid", "heavy"]);
  });

  it("filters by category, purity and weight band", () => {
    expect(filterProducts(PRODUCTS, { sort: "new" })).toHaveLength(24);
    expect(filterProducts(PRODUCTS, { cat: "chain", sort: "new" }).map((p) => p.slug)).toEqual(["thali-kodi-chain", "rope-chain", "box-chain"]);
    expect(filterProducts(PRODUCTS, { purity: "24K", sort: "new" }).every((p) => p.category === "coin")).toBe(true);
    expect(filterProducts(PRODUCTS, { band: "light", sort: "new" }).every((p) => p.weightG < 10)).toBe(true);
  });

  it("sorts by price, weight and new arrivals", () => {
    const byPrice = filterProducts(PRODUCTS, { cat: "chain", sort: "price" }).map((p) => p.slug);
    expect(byPrice).toEqual(["rope-chain", "box-chain", "thali-kodi-chain"]);
    expect(filterProducts(PRODUCTS, { cat: "chain", sort: "price-desc" }).map((p) => p.slug)).toEqual([...byPrice].reverse());
    const w = filterProducts(PRODUCTS, { sort: "weight" }).map((p) => p.weightG);
    expect(w).toEqual([...w].sort((a, b) => a - b));
    const news = filterProducts(PRODUCTS, { sort: "new" });
    const firstOld = news.findIndex((p) => !p.isNew);
    expect(news.slice(firstOld).some((p) => p.isNew)).toBe(false);
  });

  it("suggests same-category pieces first, never the piece itself, topped up to 4", () => {
    const chain = PRODUCTS.find((p) => p.slug === "rope-chain")!;
    const r = related(chain);
    expect(r).toHaveLength(4);
    expect(r.slice(0, 2).every((p) => p.category === "chain")).toBe(true);
    expect(r.some((p) => p.slug === chain.slug)).toBe(false);
    const diamond = PRODUCTS.find((p) => p.category === "diamond")!;
    expect(related(diamond)).toHaveLength(4);
  });
});
