import { describe, it, expect } from "vitest";
import { initialState, demoSeed, reduce, load, cartTotals, type DemoState, type Action } from "../demo-state";
import { digiBalance, planSummary } from "../scheme";

const catalogOrder = (): Extract<Action, { type: "placeOrder" }>["order"] => ({
  kind: "catalog", lines: [{ id: "x", slug: "rope-chain", mode: "buy", qty: 1 }], fulfilment: "pickup", total: 1, advancePaid: 0, payMethod: "upi",
});
const run = (s: DemoState, ...a: Action[]) => a.reduce(reduce, s);

describe("load", () => {
  it("falls back to initialState", () => {
    expect(load(null)).toEqual(initialState);
    expect(load("{bad")).toEqual(initialState);
    expect(load('{"version":0}')).toEqual(initialState);
  });
  it("round-trips a valid state", () => {
    const s = run(initialState, { type: "signInDemo" });
    expect(load(JSON.stringify(s))).toEqual(s);
  });
});

describe("reduce", () => {
  it("signInDemo loads the seed", () => {
    const s = reduce(initialState, { type: "signInDemo" });
    expect(s.user).not.toBeNull();
    expect(s.plans).toHaveLength(1);
    expect(s.plans[0].monthly).toBe(5000);
    expect(s.plans[0].payments).toHaveLength(7);
    expect(digiBalance(s.digi)).toBe(2.35);
    expect(s.orders).toHaveLength(1);
    expect(s.orders[0]).toMatchObject({ id: "SAJ-09871", kind: "custom", status: "making" });
    expect(s.nextId).toBe(10001);
    expect(demoSeed.user).not.toBeNull();
  });
  it("signOut clears user; reset restores initial", () => {
    const s = run(initialState, { type: "signInDemo" }, { type: "signOut" });
    expect(s.user).toBeNull();
    expect(run(s, { type: "reset" })).toEqual(initialState);
  });
  it("cart add merges, setQty and removeLine work", () => {
    let s = run(initialState, { type: "addToCart", line: { slug: "rope-chain", mode: "buy", qty: 1 } }, { type: "addToCart", line: { slug: "rope-chain", mode: "buy", qty: 2 } });
    expect(s.cart).toHaveLength(1);
    expect(s.cart[0].qty).toBe(3);
    s = reduce(s, { type: "setQty", id: s.cart[0].id, qty: 1 });
    expect(s.cart[0].qty).toBe(1);
    s = reduce(s, { type: "removeLine", id: s.cart[0].id });
    expect(s.cart).toEqual([]);
  });
  it("rejects prebook of a non-prebookable product", () => {
    const s = reduce(initialState, { type: "addToCart", line: { slug: "lakshmi-gold-coin-4g", mode: "prebook", qty: 1 } });
    expect(s.cart).toEqual([]);
  });
  it("placeOrder issues sequential ids, clears cart, status booked", () => {
    let s = run(initialState, { type: "addToCart", line: { slug: "rope-chain", mode: "buy", qty: 1 } }, { type: "placeOrder", order: catalogOrder() });
    expect(s.orders.at(-1)).toMatchObject({ id: "SAJ-10001", status: "booked" });
    expect(s.cart).toEqual([]);
    s = reduce(s, { type: "placeOrder", order: catalogOrder() });
    expect(s.orders.at(-1)?.id).toBe("SAJ-10002");
  });
  it("seed does not consume nextId", () => {
    const s = run(initialState, { type: "signInDemo" }, { type: "placeOrder", order: catalogOrder() });
    expect(s.orders.at(-1)?.id).toBe("SAJ-10001");
  });
  it("custom order keeps the cart", () => {
    const s = run(initialState, { type: "addToCart", line: { slug: "rope-chain", mode: "buy", qty: 1 } },
      { type: "placeOrder", order: { ...catalogOrder(), kind: "custom", lines: [], custom: { type: "temple", purity: "22K", approxWeightG: 30 } } });
    expect(s.cart).toHaveLength(1);
  });
  it("joinPlan validates and creates a plan", () => {
    expect(reduce(initialState, { type: "joinPlan", monthly: 1250 })).toBe(initialState);
    const s = reduce(initialState, { type: "joinPlan", monthly: 2000, now: "2026-11-26" });
    expect(s.plans[0]).toMatchObject({ monthly: 2000, startedOn: "2026-11-26", payments: [] });
  });
  it("payInstalment appends one payment; no-op when complete", () => {
    let s = run(initialState, { type: "signInDemo" });
    const id = s.plans[0].id;
    s = reduce(s, { type: "payInstalment", planId: id });
    expect(s.plans[0].payments).toHaveLength(8);
    expect(s.plans[0].payments[7]).toEqual({ date: "2026-12-05", amount: 5000 });
    for (let i = 0; i < 10; i++) s = reduce(s, { type: "payInstalment", planId: id });
    expect(s.plans[0].payments).toHaveLength(11);
    expect(planSummary(s.plans[0]).complete).toBe(true);
    expect(reduce(s, { type: "payInstalment", planId: id })).toBe(s);
  });
  it("buyDigi rejects < 100 and adds a txn otherwise", () => {
    const s = reduce(initialState, { type: "buyDigi", rupees: 50 });
    expect(s).toBe(initialState);
    const t = reduce(initialState, { type: "buyDigi", rupees: 1000 });
    expect(t.digi.txns).toHaveLength(1);
    expect(t.digi.txns[0]).toMatchObject({ rupees: 1000, grams: 0.0794 });
  });
  it("book adds an appointment", () => {
    const s = reduce(initialState, { type: "book", appt: { kind: "sell", name: "A", phone: "1", date: "2026-12-01" } });
    expect(s.appointments).toHaveLength(1);
    expect(s.appointments[0].id).toBeTruthy();
  });
});

describe("cartTotals", () => {
  it("buy pays in full, prebook pays advance", () => {
    expect(cartTotals([
      { id: "a", slug: "rope-chain", mode: "buy", qty: 1 },
      { id: "b", slug: "rope-chain", mode: "prebook", qty: 1 },
    ])).toEqual({ total: 234737, advance: 11330, payNow: 132767 });
  });
});
