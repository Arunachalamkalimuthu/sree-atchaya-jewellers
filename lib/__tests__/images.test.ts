import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { IMAGE_MANIFEST } from "../image-manifest";
import { hasImage } from "../images";

describe("image manifest", () => {
  it("lists only files that exist under public/images", () => {
    for (const f of IMAGE_MANIFEST) {
      expect(f.startsWith("/images/"), f).toBe(true);
      expect(existsSync(path.join(__dirname, "../../public", f)), f).toBe(true);
    }
  });

  it("hasImage answers from the manifest and ignores query strings", () => {
    const first = IMAGE_MANIFEST[0];
    if (first) {
      expect(hasImage(first)).toBe(true);
      expect(hasImage(`${first}?w=640`)).toBe(true);
    }
    expect(hasImage("/images/products/not-a-real-piece.jpg")).toBe(false);
    expect(hasImage("")).toBe(false);
    expect(hasImage(undefined)).toBe(false);
  });
});
