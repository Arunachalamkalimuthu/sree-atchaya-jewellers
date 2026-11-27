import { describe, it, expect } from "vitest";
import { isValidMonthly, planSummary, rupeesToGrams, digiBalance, type MonthlyPlan } from "../scheme";

const plan = (n: number): MonthlyPlan => ({
  id: "P", monthly: 5000, startedOn: "2026-05-05",
  payments: Array.from({ length: n }, (_, i) => ({ date: `2026-${String(5 + i).padStart(2, "0")}-05`, amount: 5000 })),
});

describe("scheme", () => {
  it("validates monthly amounts", () => {
    expect(isValidMonthly(1000)).toBe(true);
    expect(isValidMonthly(1250)).toBe(false);
    expect(isValidMonthly(25500)).toBe(false);
    expect(isValidMonthly(500)).toBe(false);
  });
  it("summarises a plan with 7 payments", () => {
    expect(planSummary(plan(7))).toMatchObject({
      paidCount: 7, dueCount: 4, paidAmount: 35000, bonus: 5000, maturityValue: 60000, complete: false, nextDueDate: "2026-12-05",
    });
  });
  it("is complete after 11 payments with no next due date", () => {
    const s = planSummary({ ...plan(0), payments: Array.from({ length: 11 }, () => ({ date: "2027-03-05", amount: 5000 })) });
    expect(s.complete).toBe(true);
    expect(s.dueCount).toBe(0);
    expect(s.nextDueDate).toBeNull();
  });
  it("rolls month-end dates and year-end", () => {
    const p: MonthlyPlan = { id: "P", monthly: 1000, startedOn: "2026-01-31", payments: [{ date: "2026-12-31", amount: 1000 }] };
    expect(planSummary(p).nextDueDate).toBe("2027-01-31");
  });
  it("converts rupees to grams floored at 4 dp", () => {
    expect(rupeesToGrams(1000, 12590)).toBe(0.0794);
  });
  it("sums digi balance", () => {
    expect(digiBalance({ txns: [{ date: "d", rupees: 1, grams: 1.2, rate: 1 }, { date: "d", rupees: 1, grams: 0.1, rate: 1 }] })).toBe(1.3);
  });
});
