"use client";
import { OFFER, RATES, SCHEME } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { scheme } from "@/lib/i18n/dict/scheme";
import { Button } from "@/components/ui/Button";
import { OrnateFrame } from "@/components/brand/OrnateFrame";
import { PlanCalculator, calcFor } from "./PlanCalculator";
import { Passbook } from "./Passbook";
import { DigiBuy } from "./DigiBuy";

const SAMPLE = 5000;

/** The /scheme/ landing page. Client component because "My schemes" reads the demo store. */
export function SchemeView() {
  const t = useT(scheme);
  const [lang] = useLang();
  const { state, dispatch } = useDemo();
  const sample = calcFor(SAMPLE);
  const ld = SCHEME.luckyDraw;

  const faq: [string, string][] = [
    [t("faq1q"), t("faq1a")],
    [t("faq2q"), t("faq2a", { months: SCHEME.months, bonus: SCHEME.bonusInstalments, sample: formatINR(SAMPLE), paid: formatINR(sample.paidAmount), maturity: formatINR(sample.maturityValue) })],
    [t("faq3q"), t("faq3a", { months: SCHEME.months })],
    [t("faq4q"), t("faq4a")],
    [t("faq5q"), t("faq5a", { pct: OFFER.wastagePct })],
  ];

  return (
    <>
      <section className="bg-maroon text-ivory">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-gold-light sm:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-4 max-w-xl text-lg text-ivory/85">{t("heroLead", { months: SCHEME.months, pct: OFFER.wastagePct })}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="border border-maroon/15 bg-white/70 p-6 sm:p-8 lg:col-span-3">
            <h2 className="font-display text-3xl font-semibold text-maroon">{t("monthlyName")}</h2>
            <p className="num mt-4 font-display text-6xl font-semibold leading-none text-maroon">
              {SCHEME.months} + {SCHEME.bonusInstalments}
            </p>
            <p className="mt-3 text-[17px] text-maroon-deep">{t("monthlyLine", { months: SCHEME.months, bonus: SCHEME.bonusInstalments })}</p>
            <p className="mt-4 max-w-md text-[15px] text-maroon-deep/80">
              {t("monthlyRange", { min: formatINR(SCHEME.minMonthly), max: formatINR(SCHEME.maxMonthly), step: formatINR(SCHEME.stepMonthly) })}
            </p>
            <p className="mt-2 max-w-md text-[15px] text-maroon-deep/80">{t("monthlyRedeem", { pct: OFFER.wastagePct })}</p>
            <Button variant="maroon" size="lg" className="mt-6" href={routes.schemeJoin("monthly")}>{t("monthlyCta")}</Button>
          </div>

          <div className="bg-emerald p-6 text-ivory sm:p-8 lg:col-span-2">
            <h2 className="font-display text-3xl font-semibold text-gold-light">{t("digiName")}</h2>
            <p className="num mt-4 font-display text-5xl font-semibold leading-none text-ivory">{formatINR(SCHEME.digiMinRupees)}</p>
            <p className="mt-3 text-[17px]">{t("digiLine", { min: formatINR(SCHEME.digiMinRupees) })}</p>
            <p className="mt-4 text-[15px] text-ivory/80">{t("digiRate", { rate: formatINR(RATES.g24) })}</p>
            <Button variant="gold" size="lg" className="mt-6" href={routes.schemeJoin("digi")}>{t("digiCta")}</Button>
          </div>
        </div>
      </section>

      <section className="border-y border-gold/40 bg-white/40" aria-labelledby="my-schemes">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <h2 id="my-schemes" className="font-display text-3xl font-semibold text-maroon">{t("mySchemes")}</h2>
          {state.user ? (
            <>
              <p className="mt-1 text-sm text-maroon-deep/70">{t("signedInAs", { name: state.user.name })}</p>
              <div className="mt-6 grid gap-6 lg:grid-cols-5">
                <div className="space-y-6 lg:col-span-3">
                  {state.plans.length === 0 && <p className="text-maroon-deep/75">{t("noPlans")}</p>}
                  {state.plans.map((p) => <Passbook key={p.id} plan={p} />)}
                </div>
                <DigiBuy className="border border-maroon/20 lg:col-span-2 lg:self-start" />
              </div>
            </>
          ) : (
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <p className="max-w-xl text-[15px] text-maroon-deep/80">{t("signedOutLead")}</p>
              <Button variant="maroon" onClick={() => dispatch({ type: "signInDemo" })}>{t("signInDemo")}</Button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8" aria-labelledby="calc">
        <h2 id="calc" className="mb-6 font-display text-3xl font-semibold text-maroon">{t("calcTitle")}</h2>
        <PlanCalculator />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
        <OrnateFrame tone="maroon">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-semibold text-gold-light sm:text-4xl">{t("luckyTitle", { winners: ld.winners })}</h2>
              <p className="mt-3 max-w-xl text-[16px] text-ivory/90">
                {t("luckyBody", { amount: formatINR(ld.joinAmount), from: formatDate(ld.from, lang), to: formatDate(ld.to, lang), winners: ld.winners })}
              </p>
            </div>
            <Button variant="gold" size="lg" href={`${routes.schemeJoin("monthly")}&amount=${ld.joinAmount}`}>
              {t("luckyCta", { amount: formatINR(ld.joinAmount) })}
            </Button>
          </div>
        </OrnateFrame>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-3xl font-semibold text-maroon">{t("faqTitle")}</h2>
        <p className="mt-1 text-sm text-maroon-deep/65">{t("faqSample")}</p>
        <div className="mt-5 divide-y divide-maroon/15 border-y border-maroon/15">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold text-maroon focus-visible:outline-2 focus-visible:outline-gold [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden className="text-2xl font-normal text-gold group-open:hidden">+</span>
                <span aria-hidden className="hidden text-2xl font-normal text-gold group-open:inline">&minus;</span>
              </summary>
              <p className="mt-2 max-w-prose text-[15px] text-maroon-deep/85">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mx-auto max-w-3xl px-4 pb-14 text-center text-xs text-maroon-deep/60 sm:px-6">{t("terms")}</p>
    </>
  );
}
