"use client";
import { RATES, SITE } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { formatDate, formatTime, useLang, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";

const SMALL = [
  { key: "g24", label: "rateGold24" },
  { key: "g18", label: "rateGold18" },
  { key: "silver", label: "rateSilver" },
] as const;

/**
 * `<RateCard />`: the shop's rate board, cut for a 390 px phone. 22K leads in big display numerals; 24K, 18K and
 * silver sit in a ruled row beneath. Maroon field, fine double gold frame, the date and time from SITE.
 * The numerals settle in once on load (the one orchestrated motion; off under reduced motion).
 */
export function RateCard({ className = "" }: { className?: string }) {
  const t = useT(common);
  const [lang] = useLang();
  const stamp = { date: formatDate(SITE.ratesDate, lang), time: formatTime(SITE.ratesTime, lang) };

  return (
    <section aria-labelledby="app-rate-title" className={`relative bg-maroon text-ivory ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-[6px] border border-gold/70" />
      <div aria-hidden className="pointer-events-none absolute inset-[9px] border border-gold/25" />
      <div className="relative px-5 pb-4 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="app-rate-title" className="font-display text-[1.3rem] font-semibold leading-tight text-ivory">{t("rateBoardTitle")}</h2>
          <p className="shrink-0 text-[12px] text-gold-light/85">{t("rateStamp", stamp)}</p>
        </div>
        <div aria-hidden className="mt-3 h-px bg-gold/45" />

        <dl>
          <div className="flex items-end justify-between gap-3 pb-3 pt-3.5">
            <dt className="min-w-0">
              <span className="block font-display text-[1.35rem] font-semibold leading-none text-ivory">{t("rateGold22")}</span>
              <span className="mt-1 block text-[12px] leading-snug text-ivory/60">{t("rateSub22")}</span>
            </dt>
            <dd className="sa-settle whitespace-nowrap font-display text-[2.6rem] font-semibold leading-none text-gold-light num min-[380px]:text-[2.9rem]" style={{ animationDelay: "120ms" }}>
              {formatINR(RATES.g22)}
              <span className="ml-1 font-sans text-[13px] font-normal text-ivory/60">{t("perGram")}</span>
            </dd>
          </div>
          <div className="grid grid-cols-3 border-t border-gold/30">
            {SMALL.map((r, i) => (
              <div key={r.key} className={`min-w-0 py-3 ${i > 0 ? "border-l border-gold/25 pl-3" : "pr-2"}`}>
                <dt className="font-display text-[1.05rem] font-semibold leading-none text-ivory">{t(r.label)}</dt>
                <dd
                  className="sa-settle mt-1.5 whitespace-nowrap font-display text-[1.3rem] font-semibold leading-none text-gold-light num"
                  style={{ animationDelay: `${230 + i * 110}ms` }}
                >
                  {formatINR(RATES[r.key])}
                  <span className="ml-0.5 font-sans text-[10.5px] font-normal text-ivory/55">{t("perGram")}</span>
                </dd>
              </div>
            ))}
          </div>
        </dl>
        <div aria-hidden className="h-px bg-gold/45" />
        <p className="mt-2 text-[12px] leading-snug text-ivory/65">{t("rateNote")}</p>
      </div>
    </section>
  );
}
