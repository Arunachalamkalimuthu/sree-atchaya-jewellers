import { afterEach, describe, expect, it, vi } from "vitest";
import { asset } from "../asset";

afterEach(() => vi.unstubAllEnvs());

describe("asset", () => {
  it("prefixes the base path", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/sree-atchaya-jewellers");
    expect(asset("/images/a.jpg")).toBe("/sree-atchaya-jewellers/images/a.jpg");
  });
  it("returns the plain path with an empty base path", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    expect(asset("/images/a.jpg")).toBe("/images/a.jpg");
  });
});
