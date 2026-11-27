import { SITE, RATES, SCHEME } from "./site.config";
import { getProduct, type CategoryId, type Purity } from "./catalog";
import { priceBreakdown, type PriceMode } from "./pricing";
import { addMonth, isValidMonthly, rupeesToGrams, type DigiGold, type MonthlyPlan } from "./scheme";

export type OrderStatus = "booked" | "design_approved" | "making" | "hallmarked" | "ready";
export const ORDER_STEPS: OrderStatus[] = ["booked", "design_approved", "making", "hallmarked", "ready"];

export interface CartLine { id: string; slug: string; mode: PriceMode; size?: string; qty: number }
export interface CustomSpec {
  type: CategoryId; purity: Purity; approxWeightG: number; budget?: number; notes?: string;
  refImage?: string; // dataURL, preview only
}
export interface Order {
  id: string; kind: "catalog" | "custom"; lines: CartLine[]; custom?: CustomSpec; fulfilment: "pickup" | "delivery";
  total: number; advancePaid: number; payMethod: "upi" | "card" | "netbanking"; status: OrderStatus; createdAt: string;
}
export interface Appointment {
  id: string; kind: "sell" | "release"; name: string; phone: string; date: string;
  grams?: number; purity?: string; bank?: string; loanAmount?: number;
}
export interface DemoState {
  version: 1;
  user: { name: string; phone: string } | null;
  cart: CartLine[]; orders: Order[]; plans: MonthlyPlan[]; digi: DigiGold; appointments: Appointment[];
  nextId: number;
}

/** `now` (YYYY-MM-DD) is injected by the caller; reduce itself never reads the clock. Defaults to SITE.ratesDate. */
export type Action = (
  | { type: "signInDemo" }
  | { type: "signIn"; name: string; phone: string }
  | { type: "signOut" }
  | { type: "reset" }
  | { type: "addToCart"; line: Omit<CartLine, "id"> }
  | { type: "setQty"; id: string; qty: number }
  | { type: "removeLine"; id: string }
  | { type: "placeOrder"; order: Omit<Order, "id" | "status" | "createdAt"> }
  | { type: "joinPlan"; monthly: number }
  | { type: "payInstalment"; planId: string }
  | { type: "buyDigi"; rupees: number }
  | { type: "book"; appt: Omit<Appointment, "id"> }
) & { now?: string };

export const initialState: DemoState = {
  version: 1, user: null, cart: [], orders: [], plans: [], digi: { txns: [] }, appointments: [], nextId: 10001,
};

const seedPrice = priceBreakdown({ purity: "22K", weightG: 42, category: "temple" }, "buy");

export const demoSeed: DemoState = {
  ...initialState,
  user: { name: "Priya Raman", phone: "+91 90000 00000" },
  plans: [{
    id: "PLN-1", monthly: 5000, startedOn: "2026-05-05",
    payments: ["2026-05-05", "2026-06-05", "2026-07-05", "2026-08-05", "2026-09-05", "2026-10-05", "2026-11-05"].map((date) => ({ date, amount: 5000 })),
  }],
  digi: {
    txns: [
      { date: "2026-08-12", rupees: 14000, grams: 1.2, rate: 11667 },
      { date: "2026-10-03", rupees: 9800, grams: 0.8, rate: 12250 },
      { date: "2026-11-10", rupees: 4300, grams: 0.35, rate: 12286 },
    ],
  },
  orders: [{
    id: "SAJ-09871", kind: "custom", lines: [],
    custom: { type: "temple", purity: "22K", approxWeightG: 42, notes: "Temple necklace with Lakshmi pendant" },
    fulfilment: "pickup", total: seedPrice.total, advancePaid: Math.round(seedPrice.total / 10), payMethod: "upi",
    status: "making", createdAt: "2026-11-12",
  }],
};

const validQty = (q: unknown): q is number => typeof q === "number" && Number.isInteger(q) && q >= 1;
const lineId = (l: Omit<CartLine, "id">) => `${l.slug}:${l.mode}:${l.size ?? ""}`;

export function reduce(s: DemoState, a: Action): DemoState {
  const now = a.now ?? SITE.ratesDate;
  switch (a.type) {
    case "signInDemo": {
      // Apply the seed on top of the current state: keep cart, placed orders, nextId; never duplicate seed records.
      const plans = [...s.plans, ...demoSeed.plans.filter((p) => !s.plans.some((x) => x.id === p.id))];
      const key = (t: { date: string; rupees: number; grams: number }) => `${t.date}|${t.rupees}|${t.grams}`;
      const have = new Set(s.digi.txns.map(key));
      const digi = { txns: [...demoSeed.digi.txns.filter((t) => !have.has(key(t))), ...s.digi.txns] };
      const orders = [...demoSeed.orders.filter((o) => !s.orders.some((x) => x.id === o.id)), ...s.orders];
      return { ...s, user: demoSeed.user, plans, digi, orders };
    }
    case "signIn": return { ...s, user: { name: a.name, phone: a.phone } };
    case "signOut": return { ...s, user: null };
    case "reset": return initialState;
    case "addToCart": {
      const prod = getProduct(a.line.slug);
      if (!prod || !validQty(a.line.qty) || (a.line.mode === "prebook" && !prod.prebookable)) return s;
      const id = lineId(a.line);
      const has = s.cart.some((l) => l.id === id);
      return { ...s, cart: has ? s.cart.map((l) => (l.id === id ? { ...l, qty: l.qty + a.line.qty } : l)) : [...s.cart, { ...a.line, id }] };
    }
    case "setQty":
      if (a.qty === 0) return { ...s, cart: s.cart.filter((l) => l.id !== a.id) };
      if (!validQty(a.qty)) return s;
      return { ...s, cart: s.cart.map((l) => (l.id === a.id ? { ...l, qty: a.qty } : l)) };
    case "removeLine": return { ...s, cart: s.cart.filter((l) => l.id !== a.id) };
    case "placeOrder": {
      const order: Order = { ...a.order, id: `SAJ-${s.nextId}`, status: "booked", createdAt: now };
      return { ...s, orders: [...s.orders, order], cart: a.order.kind === "catalog" ? [] : s.cart, nextId: s.nextId + 1 };
    }
    case "joinPlan":
      if (!isValidMonthly(a.monthly)) return s;
      return { ...s, plans: [...s.plans, { id: `PLN-${s.plans.length + 1}`, monthly: a.monthly, startedOn: now, payments: [] }] };
    case "payInstalment": {
      const plan = s.plans.find((p) => p.id === a.planId);
      if (!plan || plan.payments.length >= SCHEME.months) return s;
      const last = plan.payments.at(-1);
      const date = last ? addMonth(last.date) : plan.startedOn;
      return { ...s, plans: s.plans.map((p) => (p === plan ? { ...p, payments: [...p.payments, { date, amount: p.monthly }] } : p)) };
    }
    case "buyDigi": {
      if (!Number.isFinite(a.rupees) || a.rupees < SCHEME.digiMinRupees) return s;
      const txn = { date: now, rupees: a.rupees, grams: rupeesToGrams(a.rupees, RATES.g24), rate: RATES.g24 };
      return { ...s, digi: { txns: [...s.digi.txns, txn] } };
    }
    case "book": return { ...s, appointments: [...s.appointments, { ...a.appt, id: `APT-${s.appointments.length + 1}` }] };
  }
}

export function load(raw: string | null): DemoState {
  if (!raw) return initialState;
  try {
    const v = JSON.parse(raw);
    const num = (x: unknown) => typeof x === "number" && Number.isFinite(x);
    const str = (x: unknown) => typeof x === "string";
    const obj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object";
    const ok = obj(v) && v.version === 1 && num(v.nextId)
      && (v.user === null || (obj(v.user) && str(v.user.name) && str(v.user.phone)))
      && Array.isArray(v.cart) && v.cart.every((l) => obj(l) && str(l.id) && str(l.slug) && (l.mode === "buy" || l.mode === "prebook") && validQty(l.qty))
      && Array.isArray(v.orders) && v.orders.every((o) => obj(o) && str(o.id) && str(o.status) && num(o.total) && Array.isArray(o.lines))
      && Array.isArray(v.plans) && v.plans.every((p) => obj(p) && str(p.id) && num(p.monthly) && str(p.startedOn)
        && Array.isArray(p.payments) && p.payments.every((x) => obj(x) && str(x.date) && num(x.amount)))
      && obj(v.digi) && Array.isArray(v.digi.txns) && v.digi.txns.every((t) => obj(t) && str(t.date) && num(t.rupees) && num(t.grams) && num(t.rate))
      && Array.isArray(v.appointments) && v.appointments.every((x) => obj(x) && str(x.id));
    if (ok) return v as unknown as DemoState;
  } catch { /* fall through */ }
  return initialState;
}

export function cartTotals(cart: CartLine[]): { total: number; advance: number; payNow: number } {
  let total = 0, advance = 0, payNow = 0;
  for (const l of cart) {
    const prod = getProduct(l.slug);
    if (!prod) continue;
    const b = priceBreakdown(prod, l.mode);
    total += b.total * l.qty;
    if (l.mode === "prebook") { advance += b.advance * l.qty; payNow += b.advance * l.qty; }
    else payNow += b.total * l.qty;
  }
  return { total, advance, payNow };
}
