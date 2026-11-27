import { describe, expect, it } from "vitest";
import { routes } from "../routes";

describe("routes", () => {
  it("website paths", () => {
    expect(routes.home()).toBe("/");
    expect(routes.shop()).toBe("/shop/");
    expect(routes.shop("necklace")).toBe("/shop/?c=necklace");
    expect(routes.product("gold-coin")).toBe("/product/gold-coin/");
    expect(routes.custom()).toBe("/custom-order/");
    expect(routes.order("a b")).toBe("/order/?id=a%20b");
  });
  it("app paths", () => {
    expect(routes.app.shop("ring")).toBe("/app/shop/?c=ring");
    expect(routes.app.product("x")).toBe("/app/product/x/");
    expect(routes.app.order("SAJ-10002")).toBe("/app/orders/view/?id=SAJ-10002");
  });
});
