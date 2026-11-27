import { RATES, SCHEME } from "./site.config";

export interface Payment { date: string; amount: number }
export interface MonthlyPlan { id: string; monthly: number; startedOn: string; payments: Payment[] }
export interface DigiTxn { date: string; rupees: number; grams: number; rate: number }
export interface DigiGold { txns: DigiTxn[] }

export const isValidMonthly = (n: number): boolean =>
  Number.isInteger(n) && n >= SCHEME.minMonthly && n <= SCHEME.maxMonthly && n % SCHEME.stepMonthly === 0;

/** Same day next month (clamped to month end), computed on the string so no timezone/clock is involved. */
export function addMonth(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const ny = m === 12 ? y + 1 : y;
  const nm = m === 12 ? 1 : m + 1;
  const last = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
  return `${ny}-${String(nm).padStart(2, "0")}-${String(Math.min(d, last)).padStart(2, "0")}`;
}

export function planSummary(plan: MonthlyPlan) {
  const paidCount = plan.payments.length;
  const complete = paidCount >= SCHEME.months;
  const last = plan.payments.at(-1);
  return {
    paidCount,
    dueCount: Math.max(0, SCHEME.months - paidCount),
    paidAmount: plan.payments.reduce((s, p) => s + p.amount, 0),
    bonus: SCHEME.bonusInstalments * plan.monthly,
    maturityValue: (SCHEME.months + SCHEME.bonusInstalments) * plan.monthly,
    nextDueDate: complete ? null : last ? addMonth(last.date) : plan.startedOn,
    complete,
  };
}

export const rupeesToGrams = (rupees: number, rate: number = RATES.g24): number =>
  Math.floor((rupees / rate) * 10000 + 1e-9) / 10000;

export const digiBalance = (d: DigiGold): number =>
  Math.round(d.txns.reduce((s, t) => s + t.grams, 0) * 10000) / 10000;
