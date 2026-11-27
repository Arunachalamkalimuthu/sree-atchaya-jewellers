import { describe, expect, it } from "vitest";
import { ADDRESS_VARS, SITE } from "@/lib/site.config";

describe("SITE contact facts (from the shop's Facebook page)", () => {
  it("has the full showroom address", () => {
    expect(SITE.address.line1).toBe("No-456, First floor, Shop No: F2");
    expect(SITE.address.line2).toBe("Swarnalaya Complex");
    expect(SITE.address.city).toBe("Coimbatore");
    expect(SITE.address.pin).toBe("641001");
    expect(ADDRESS_VARS).toEqual({ line1: SITE.address.line1, line2: SITE.address.line2, pin: "641001" });
  });

  it("keeps the enquiry number and the existing lines", () => {
    expect(SITE.phones.enquiry).toBe("+91 93633 95916");
    expect(SITE.phones.goldRelease).toBe("+91 93630 29916");
    expect(SITE.phones.alt).toBe("+91 93449 29916");
    expect(SITE.phones.goldCoins).toBe("+91 93631 29916");
  });

  it("stores email and social handles as plain text, not links", () => {
    expect(SITE.email).toBe("sreeatchayaajewellers@gmail.com");
    expect(SITE.social.instagram).toBe("sree_atchaya_jewellers");
    expect(SITE.social.facebook).toBe("ஸ்ரீ அட்சயா ஜூவல்லர்ஸ்");
    for (const v of [SITE.email, ...Object.values(SITE.social), ...Object.values(SITE.phones)]) {
      expect(v).not.toMatch(/^(tel|mailto|https?):/);
    }
  });

  it("lists the service area in English and Tamil, same length", () => {
    expect(SITE.serviceArea).toHaveLength(10);
    expect(SITE.serviceAreaTa).toHaveLength(SITE.serviceArea.length);
    expect(SITE.serviceArea[0]).toMatch(/^Coimbatore/);
    expect(SITE.serviceArea).toContain("Dharmapuri");
  });
});
