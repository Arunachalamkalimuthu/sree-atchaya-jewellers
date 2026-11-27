"use client";
import { useState } from "react";
import { SCHEME } from "@/lib/site.config";
import { planSummary, type MonthlyPlan } from "@/lib/scheme";
import { formatINR } from "@/lib/pricing";
import { useDemo } from "@/lib/use-demo";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { scheme } from "@/lib/i18n/dict/scheme";
import { Button } from "@/components/ui/Button";
import { PaymentSheet } from "@/components/ui/PaymentSheet";
import { Icon } from "@/components/ui/Icon";

/**
 * `<Passbook plan className?>`: one monthly plan as a passbook page: instalments paid (e.g. 7/11), progress ticks,
 * amounts, next due date, instalment list and a "Pay instalment" button (PaymentSheet, then payInstalment).
 * Pass the plan from `useDemo().state.plans`; it re-renders with the new plan after paying.
 * Self-contained (reads and writes the demo store itself); fits a 360 px phone frame.
 */
export function Passbook({ plan, className = "" }: { plan: MonthlyPlan; className?: string }) {
  const t = useT(scheme);
  const [lang] = useLang();
  const { dispatch } = useDemo();
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const s = planSummary(plan);

  const figures: [string, number][] = [
    [t("pbMonthly"), plan.monthly],
    [t("pbPaid"), s.paidAmount],
    [t("pbBonus"), s.bonus],
    [t("pbMaturity"), s.maturityValue],
  ];

  return (
    <article className={`border border-maroon/20 bg-white/70 ${className}`} aria-label={t("pbTitle")}>
      <header className="flex items-start justify-between gap-4 border-b border-gold/40 bg-maroon px-5 py-4 text-ivory">
        <div>
          <h3 className="font-display text-xl font-semibold text-gold-light">{t("pbTitle")}</h3>
          <p className="mt-0.5 text-[13px] text-ivory/70">{t("pbPlan", { id: plan.id })}</p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-ivory/70">{t("pbCount")}</p>
          <p className="num font-display text-4xl font-semibold leading-none text-gold-light" data-testid="passbook-count">{s.paidCount}/{SCHEME.months}</p>
        </div>
      </header>

      <div className="px-5 pt-5">
        <div
          role="img"
          aria-label={t("pbTicks", { n: s.paidCount, total: SCHEME.months })}
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${SCHEME.months}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: SCHEME.months }, (_, i) => (
            <span key={i} className={`h-2 ${i < s.paidCount ? "bg-maroon" : "border border-maroon/25"}`} />
          ))}
        </div>
        <p className="mt-2 text-[13px] text-maroon-deep/70">
          {s.complete ? t("pbComplete", { months: SCHEME.months }) : `${t("pbToGo", { n: s.dueCount })}. ${t("pbNext", { date: formatDate(s.nextDueDate!, lang) })}`}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 px-5 sm:grid-cols-4">
        {figures.map(([label, v]) => (
          <div key={label}>
            <dt className="text-[13px] text-maroon-deep/65">{label}</dt>
            <dd className="num mt-0.5 font-display text-2xl font-semibold text-maroon">{formatINR(v)}</dd>
          </div>
        ))}
      </dl>

      {done && (
        <p role="status" className="mx-5 mt-4 flex items-start gap-2 border border-emerald/30 bg-emerald/[0.06] px-3 py-2 text-sm text-emerald">
          <Icon name="check" size={16} className="mt-0.5 shrink-0" /> <span>{t("pbDone")}</span>
        </p>
      )}

      {!s.complete && (
        <div className="px-5 pt-5">
          <Button variant="gold" size="lg" full onClick={() => { setDone(false); setPaying(true); }}>
            {t("pbPay", { amount: formatINR(plan.monthly) })}
          </Button>
        </div>
      )}

      <div className="mt-5 border-t border-maroon/10 px-5 py-4">
        <h4 className="text-sm font-medium text-maroon-deep">{t("pbHistory")}</h4>
        <ol className="mt-2 divide-y divide-maroon/10 text-sm">
          {plan.payments.map((p, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-1.5">
              <span>{t("pbRow", { n: i + 1 })}</span>
              <span className="text-maroon-deep/65">{formatDate(p.date, lang)}</span>
              <span className="num font-display text-base font-semibold text-maroon">{formatINR(p.amount)}</span>
            </li>
          ))}
        </ol>
      </div>

      <PaymentSheet
        open={paying}
        amount={plan.monthly}
        note={t("pbNote", { n: s.paidCount + 1, months: SCHEME.months, id: plan.id })}
        onClose={() => setPaying(false)}
        onPaid={() => { dispatch({ type: "payInstalment", planId: plan.id }); setPaying(false); setDone(true); }}
      />
    </article>
  );
}
