import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/lib/catalog";
import { hasImage } from "@/lib/images";
import { CATEGORY_COVERS, INSTAGRAM_PICKS, NEW_ROW, TEMPLE_BRIDAL_ROW } from "../picks";

describe("home picks", () => {
  it("fills the showroom strip with six distinct photographed pieces", () => {
    expect(INSTAGRAM_PICKS).toHaveLength(6);
    expect(new Set(INSTAGRAM_PICKS.map((p) => p.slug)).size).toBe(6);
    for (const p of INSTAGRAM_PICKS) expect(hasImage(p.image), p.slug).toBe(true);
  });

  it("keeps the product rows at five tiles each", () => {
    expect(NEW_ROW).toHaveLength(5);
    expect(TEMPLE_BRIDAL_ROW).toHaveLength(5);
  });

  it("uses the coin photos for the coin band", () => {
    const coins = PRODUCTS.filter((p) => p.category === "coin");
    expect(coins.map((p) => p.weightG).sort()).toEqual([4, 8]);
    for (const p of coins) expect(hasImage(p.image), p.slug).toBe(true);
    expect(CATEGORY_COVERS.find((c) => c.id === "coin")?.product).toBeDefined();
  });
});
