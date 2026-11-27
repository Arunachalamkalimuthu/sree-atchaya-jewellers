import { describe, it, expect } from "vitest";
import { priceBreakdown, formatINR, formatGrams } from "../pricing";

describe("priceBreakdown", () => {
  it("22K chain 10 g buy", () => {
    const b = priceBreakdown({ purity: "22K", weightG: 10, category: "chain" }, "buy");
    expect(b).toMatchObject({ metalValue: 115400, making: 2500, wastage: 0, subtotal: 117900, gst: 3537, total: 121437, advance: 0 });
  });
  it("22K chain 10 g prebook", () => {
    const b = priceBreakdown({ purity: "22K", weightG: 10, category: "chain" }, "prebook");
    expect(b).toMatchObject({ ratePerGram: 11000, discountPerGram: 540, metalValue: 110000, making: 0, gst: 3300, total: 113300, advance: 11330 });
  });
  it("18K ring 4 g buy", () => {
    const b = priceBreakdown({ purity: "18K", weightG: 4, category: "ring" }, "buy");
    expect(b.metalValue).toBe(37760);
    expect(b.making).toBe(1200);
    expect(b.total).toBe(Math.round((37760 + 1200) * 1.03));
  });
  it("adds stone value before GST", () => {
    const b = priceBreakdown({ purity: "18K", weightG: 4, category: "diamond", stoneValue: 45000 }, "buy");
    expect(b.stone).toBe(45000);
    expect(b.subtotal).toBe(37760 + 2000 + 45000);
    expect(b.total).toBe(Math.round(b.subtotal * 1.03));
  });
});

describe("formatting", () => {
  it("formats rupees with Indian grouping", () => {
    expect(formatINR(121437)).toBe("₹1,21,437");
    expect(formatINR(999)).toBe("₹999");
    expect(formatINR(10000000)).toBe("₹1,00,00,000");
  });
  it("formats grams", () => expect(formatGrams(2.35)).toBe("2.350 g"));
});
