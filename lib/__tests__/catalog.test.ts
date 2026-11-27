import { describe, it, expect } from "vitest";
import { PRODUCTS, CATEGORIES, getProduct, byCategory } from "../catalog";

describe("catalog", () => {
  it("has 24 products with unique slugs", () => {
    expect(PRODUCTS).toHaveLength(24);
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(24);
  });
  it("every category has products", () => {
    for (const c of CATEGORIES) expect(byCategory(c.id).length).toBeGreaterThan(0);
  });
  it("silver and coin are not prebookable", () => {
    for (const p of PRODUCTS.filter((p) => p.category === "silver" || p.category === "coin")) expect(p.prebookable).toBe(false);
  });
  it("coins are 24K 4 g / 8 g", () => {
    expect(byCategory("coin").map((p) => [p.purity, p.weightG])).toEqual([["24K", 4], ["24K", 8]]);
  });
  it("image paths follow the slug and lookup works", () => {
    for (const p of PRODUCTS) expect(p.image).toBe(`/images/products/${p.slug}.jpg`);
    expect(getProduct("rope-chain")?.category).toBe("chain");
    expect(getProduct("nope")).toBeUndefined();
  });
});
