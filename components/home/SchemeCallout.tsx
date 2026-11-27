"use client";
import { OFFER, RATES, SCHEME } from "@/lib/site.config";
import { planSummary } from "@/lib/scheme";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { home } from "@/lib/i18n/dict/home";
import { OrnateFrame } from "@/components/brand/OrnateFrame";
import { Button } from "@/components/ui/Button";

const EXAMPLE = planSummary({ id: "example", monthly: SCHEME.minMonthly, startedOn: "", payments: [] });

/** The scheme call-out: monthly plan and Digi Gold side by side, the lucky-draw strip along the bottom. */
export function SchemeCallout() {
  const t = useT(home);
  const c = useT(common);
  const [lang] = useLang();
  const d = SCHEME.luckyDraw;
  const draw = [
    t("drawJoin", { amount: formatINR(d.joinAmount) }),
    t("drawDates", { from: formatDate(d.from, lang, { year: false }), to: formatDate(d.to, lang, { year: false }) }),
    t("drawPrizes", { n: d.winners }),
  ];

  return (
    <section aria-labelledby="scheme-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <OrnateFrame tone="maroon">
        <div className="grid gap-9 lg:grid-cols-[1fr_1.15fr_1.15fr] lg:gap-0">
          <div className="lg:pr-10">
            <h2 id="scheme-title" className="font-display text-[2rem] font-semibold leading-[1.1] text-ivory sm:text-[2.6rem]">{t("schTitle")}</h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ivory/75">{t("schIntro", { pct: OFFER.wastagePct })}</p>
          </div>

          <div className="border-t border-gold/35 pt-7 lg:border-l lg:border-t-0 lg:px-10 lg:pt-0">
            <h3 className="font-display text-[1.6rem] font-semibold text-gold-light">{t("schMonthlyTitle")}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ivory/80">
              {t("schMonthlyBody", {
                min: formatINR(SCHEME.minMonthly), max: formatINR(SCHEME.maxMonthly), months: SCHEME.months, bonus: SCHEME.bonusInstalments,
              })}
            </p>
            <p className="mt-4 font-display text-[1.45rem] font-semibold leading-snug text-ivory num">
              {t("schMonthlyExample", { monthly: formatINR(SCHEME.minMonthly), maturity: formatINR(EXAMPLE.maturityValue) })}
            </p>
            <Button href={routes.schemeJoin("monthly")} variant="gold" className="mt-6">{t("schJoinMonthly")}</Button>
          </div>

          <div className="border-t border-gold/35 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h3 className="font-display text-[1.6rem] font-semibold text-gold-light">{t("schDigiTitle")}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ivory/80">
              {t("schDigiBody", { min: formatINR(SCHEME.digiMinRupees), rate: formatINR(RATES.g24) })}
            </p>
            <p className="mt-4 whitespace-nowrap font-display text-[1.45rem] font-semibold text-ivory num">
              {formatINR(RATES.g24)}<span className="ml-1 font-sans text-sm font-normal text-ivory/60">{c("perGram")}, {c("rateGold24")}</span>
            </p>
            <Button href={routes.schemeJoin("digi")} variant="ghost-light" className="mt-6">{t("schJoinDigi")}</Button>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t border-gold/45 pt-5 sm:flex-row sm:items-baseline sm:gap-0">
          <p className="text-[14px] text-gold-light sm:pr-5">{t("drawLabel")}</p>
          <ul className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-0">
            {draw.map((s, i) => (
              <li key={i} className="font-display text-[1.3rem] font-semibold leading-snug text-ivory num sm:border-l sm:border-gold/40 sm:px-5">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </OrnateFrame>
    </section>
  );
}
