"use client";
import { useId, useState } from "react";
import { SCHEME } from "@/lib/site.config";
import { planSummary, isValidMonthly, type MonthlyPlan } from "@/lib/scheme";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n";
import { scheme } from "@/lib/i18n/dict/scheme";
import { Button } from "@/components/ui/Button";

interface Props {
  /** Starting monthly amount. Default 5000. */
  initial?: number;
  /** Called with the chosen monthly amount. Without it the join button links to the website join page. */
  onJoin?: (monthly: number) => void;
  /** Hide the join button (join flow shows its own continue button). */
  hideJoin?: boolean;
  /** Reports every change (the join flow uses it to hold the amount). */
  onChange?: (monthly: number) => void;
  className?: string;
}

/** What a plan of `monthly` rupees looks like once all instalments are paid. Uses planSummary so it can't drift from the passbook. */
export function calcFor(monthly: number) {
  const plan: MonthlyPlan = {
    id: "calc", monthly, startedOn: "2026-01-01",
    payments: Array.from({ length: SCHEME.months }, (_, i) => ({ date: `2026-01-${String(i + 1).padStart(2, "0")}`, amount: monthly })),
  };
  return planSummary(plan);
}

/**
 * `<PlanCalculator initial? onJoin? hideJoin? onChange?>`: slider from SCHEME.minMonthly to SCHEME.maxMonthly in
 * SCHEME.stepMonthly steps, with paid / bonus / maturity. Self-contained, fits a 360 px phone frame.
 */
export function PlanCalculator({ initial = 5000, onJoin, hideJoin, onChange, className = "" }: Props) {
  const t = useT(scheme);
  const id = useId();
  const [monthly, setMonthly] = useState(isValidMonthly(initial) ? initial : 5000);
  const s = calcFor(monthly);
  const pct = ((monthly - SCHEME.minMonthly) / (SCHEME.maxMonthly - SCHEME.minMonthly)) * 100;
  const set = (v: number) => { setMonthly(v); onChange?.(v); };

  const rows: { label: string; value: number; big?: boolean; testid: string }[] = [
    { label: t("calcPaid", { months: SCHEME.months }), value: s.paidAmount, testid: "calc-paid" },
    { label: t("calcBonus"), value: s.bonus, testid: "calc-bonus" },
    { label: t("calcMaturity"), value: s.maturityValue, big: true, testid: "calc-maturity" },
  ];

  return (
    <div className={`overflow-hidden rounded-[4px] border border-maroon/15 bg-white/60 ${className}`}>
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        <div className="p-6 sm:p-8">
          <label htmlFor={id} className="text-sm text-maroon-deep/75">{t("calcMonthly")}</label>
          <p className="num mt-1 font-display text-5xl font-semibold leading-none text-maroon" data-testid="calc-monthly" aria-live="polite">{formatINR(monthly)}</p>
          <input
            id={id}
            type="range"
            min={SCHEME.minMonthly}
            max={SCHEME.maxMonthly}
            step={SCHEME.stepMonthly}
            value={monthly}
            onChange={(e) => set(Number(e.target.value))}
            aria-label={t("calcSlider", { min: formatINR(SCHEME.minMonthly), max: formatINR(SCHEME.maxMonthly) })}
            className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full accent-maroon focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            style={{ background: `linear-gradient(to right, var(--maroon) ${pct}%, rgb(110 21 23 / .15) ${pct}%)` }}
          />
          <div className="num mt-2 flex justify-between text-xs text-maroon-deep/60">
            <span>{formatINR(SCHEME.minMonthly)}</span>
            <span>{formatINR(SCHEME.maxMonthly)}</span>
          </div>
          {!hideJoin && (
            <div className="mt-6">
              {onJoin ? (
                <Button variant="maroon" size="lg" full onClick={() => onJoin(monthly)}>{t("calcJoin", { amount: formatINR(monthly) })}</Button>
              ) : (
                <Button variant="maroon" size="lg" full href={`${routes.schemeJoin("monthly")}&amount=${monthly}`}>{t("calcJoin", { amount: formatINR(monthly) })}</Button>
              )}
            </div>
          )}
        </div>

        <div className="bg-maroon p-6 text-ivory sm:p-8">
          <dl>
            {rows.map((r, i) => (
              <div key={r.testid} className={`flex items-baseline justify-between gap-4 py-3.5 ${i > 0 ? "border-t border-gold/35" : ""} ${r.big ? "pt-5" : ""}`}>
                <dt className={`text-[15px] ${r.big ? "text-gold-light" : "text-ivory/80"}`}>{r.label}</dt>
                <dd className={`num whitespace-nowrap font-display font-semibold ${r.big ? "text-4xl text-gold-light" : "text-2xl text-ivory"}`} data-testid={r.testid}>
                  {formatINR(r.value)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[13px] text-ivory/65">
            {t("calcNote", { n: SCHEME.months + SCHEME.bonusInstalments, amount: formatINR(monthly) })}
          </p>
        </div>
      </div>
    </div>
  );
}
