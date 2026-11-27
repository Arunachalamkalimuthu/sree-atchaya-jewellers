"use client";
import { OFFER, RATES, SCHEME } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { scheme } from "@/lib/i18n/dict/scheme";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Banner";
import { SectionHead } from "@/components/home/SectionHead";
import { BANNERS } from "@/lib/images";
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

  const card = "rounded-[6px] border border-line bg-white px-5 py-6 sm:px-8 sm:py-8";
  return (
    <>
      <Banner
        src={BANNERS.scheme}
        size="hero"
        as="h1"
        eager
        headline={t("heroTitle")}
        detail={t("heroLead", { months: SCHEME.months, pct: OFFER.wastagePct })}
        className="h-[300px] sm:h-[340px]"
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-5 lg:gap-6">
          <div className={`${card} lg:col-span-3`}>
            <h2 className="text-[20px] font-semibold text-ink">{t("monthlyName")}</h2>
            <p className="num mt-3 text-[36px] font-semibold leading-none text-maroon">
              {SCHEME.months} + {SCHEME.bonusInstalments}
            </p>
            <p className="mt-3 text-[16px] text-ink">{t("monthlyLine", { months: SCHEME.months, bonus: SCHEME.bonusInstalments })}</p>
            <p className="mt-3 max-w-md text-[15px] text-mute">
              {t("monthlyRange", { min: formatINR(SCHEME.minMonthly), max: formatINR(SCHEME.maxMonthly), step: formatINR(SCHEME.stepMonthly) })}
            </p>
            <p className="mt-2 max-w-md text-[15px] text-mute">{t("monthlyRedeem", { pct: OFFER.wastagePct })}</p>
            <Button variant="maroon" size="lg" className="mt-6" href={routes.schemeJoin("monthly")}>{t("monthlyCta")}</Button>
          </div>

          <div className={`${card} lg:col-span-2`}>
            <h2 className="text-[20px] font-semibold text-ink">{t("digiName")}</h2>
            <p className="num mt-3 text-[36px] font-semibold leading-none text-maroon">{formatINR(SCHEME.digiMinRupees)}</p>
            <p className="mt-3 text-[16px] text-ink">{t("digiLine", { min: formatINR(SCHEME.digiMinRupees) })}</p>
            <p className="mt-3 text-[15px] text-mute">{t("digiRate", { rate: formatINR(RATES.g24) })}</p>
            <Button variant="maroon" size="lg" className="mt-6" href={routes.schemeJoin("digi")}>{t("digiCta")}</Button>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-cream" aria-labelledby="my-schemes">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <SectionHead id="my-schemes" title={t("mySchemes")} intro={state.user ? t("signedInAs", { name: state.user.name }) : undefined} />
          {state.user ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-5 lg:gap-6">
              <div className="space-y-4 lg:col-span-3">
                {state.plans.length === 0 && <p className="text-mute">{t("noPlans")}</p>}
                {state.plans.map((p) => <Passbook key={p.id} plan={p} />)}
              </div>
              <DigiBuy className="rounded-[6px] border border-line lg:col-span-2 lg:self-start" />
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p className="max-w-xl text-[15px] text-mute">{t("signedOutLead")}</p>
              <Button variant="maroon" onClick={() => dispatch({ type: "signInDemo" })}>{t("signInDemo")}</Button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8" aria-labelledby="calc">
        <SectionHead id="calc" title={t("calcTitle")} className="mb-6" />
        <PlanCalculator />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
        <div className="rounded-[6px] border border-gold/60 bg-white px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-[22px] font-semibold leading-tight text-ink sm:text-[28px]">{t("luckyTitle", { winners: ld.winners })}</h2>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-mute">
                {t("luckyBody", { amount: formatINR(ld.joinAmount), from: formatDate(ld.from, lang), to: formatDate(ld.to, lang), winners: ld.winners })}
              </p>
            </div>
            <Button variant="maroon" size="lg" href={`${routes.schemeJoin("monthly")}&amount=${ld.joinAmount}`}>
              {t("luckyCta", { amount: formatINR(ld.joinAmount) })}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8" aria-labelledby="faq">
        <SectionHead id="faq" title={t("faqTitle")} intro={t("faqSample")} />
        <div className="mt-5 divide-y divide-line border-y border-line">
          {faq.map(([q, a]) => (
            <details key={q} className="group py-3">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-gold [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden className="text-2xl font-normal text-maroon group-open:hidden">+</span>
                <span aria-hidden className="hidden text-2xl font-normal text-maroon group-open:inline">&minus;</span>
              </summary>
              <p className="mt-2 max-w-prose text-[15px] text-mute">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mx-auto max-w-3xl px-4 pb-14 text-center text-xs text-mute sm:px-6">{t("terms")}</p>
    </>
  );
}
