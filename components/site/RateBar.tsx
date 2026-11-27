"use client";
import { RATES, SITE } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { formatDate, formatTime, useLang, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";

type Key = "g22" | "g24" | "g18" | "silver";
const ROWS: { key: Key; label: "rateGold22" | "rateGold24" | "rateGold18" | "rateSilver"; sub: "rateSub22" | "rateSub24" | "rateSub18" | "rateSubSilver" }[] = [
  { key: "g22", label: "rateGold22", sub: "rateSub22" },
  { key: "g24", label: "rateGold24", sub: "rateSub24" },
  { key: "g18", label: "rateGold18", sub: "rateSub18" },
  { key: "silver", label: "rateSilver", sub: "rateSubSilver" },
];

function useStamp() {
  const [lang] = useLang();
  return { date: formatDate(SITE.ratesDate, lang), time: formatTime(SITE.ratesTime, lang) };
}

/**
 * `<RateBar compact?>`.
 * - `compact`: the thin maroon-deep strip above the site header ("Today's rate, 26 Nov 2026, 10:00 AM" and four rates).
 * - otherwise: the full rate board (same as `<RateBoard />`), for the home page and app home.
 */
export function RateBar({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return compact ? <RateStrip className={className} /> : <RateBoard className={className} />;
}

function RateStrip({ className }: { className: string }) {
  const t = useT(common);
  const stamp = useStamp();
  return (
    <div className={`bg-maroon-deep text-ivory ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-1.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8 lg:py-2">
        <p className="text-[12px] leading-tight text-gold-light/85 lg:text-[13px]">{t("rateStripLabel", stamp)}</p>
        <dl className="grid grid-cols-4 divide-x divide-gold/25 lg:flex lg:items-baseline">
          {ROWS.map((r) => (
            <div key={r.key} className="flex flex-col items-start px-2 first:pl-0 last:pr-0 lg:flex-row lg:items-baseline lg:gap-2 lg:px-4">
              <dt className="text-[11px] leading-tight text-ivory/65 lg:text-[12.5px]">{t(r.label)}</dt>
              <dd className="font-display text-[15px] font-semibold leading-tight text-gold-light num lg:text-[17px]">
                {formatINR(RATES[r.key])}<span className="ml-0.5 font-sans text-[10.5px] font-normal text-ivory/55">{t("perGram")}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/**
 * `<RateBoard />`: the shop's daily gold-rate board, the site's signature. Large display numerals on maroon in a
 * fine gold frame. The numerals settle in once on load (the one orchestrated motion; off under reduced motion).
 */
export function RateBoard({ className = "" }: { className?: string }) {
  const t = useT(common);
  const stamp = useStamp();
  return (
    <section aria-labelledby="rate-board-title" className={`relative bg-maroon text-ivory ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-[8px] border border-gold/70 sm:inset-[10px]" />
      <div aria-hidden className="pointer-events-none absolute inset-[12px] border border-gold/25 sm:inset-[14px]" />
      <div className="relative px-6 py-7 sm:px-10 sm:py-9">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 id="rate-board-title" className="font-display text-[1.7rem] font-semibold leading-tight text-ivory sm:text-[2rem]">
            {t("rateBoardTitle")}
          </h2>
          <p className="text-sm text-gold-light/90">{t("rateStamp", stamp)}</p>
        </div>
        <div aria-hidden className="mt-4 h-px bg-gold/45" />
        <dl className="grid grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          {ROWS.map((r, i) => {
            const lead = i === 0;
            return (
              <div
                key={r.key}
                className={`py-5 sm:py-6 ${i % 2 === 1 ? "border-l border-gold/25 pl-4 sm:pl-6" : "pr-4"} ${i >= 2 ? "border-t border-gold/25 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:border-gold/25 lg:pl-6" : ""} ${i > 0 ? "lg:pr-0" : "lg:pr-6"}`}
              >
                <dt className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="font-display text-xl font-semibold text-ivory">{t(r.label)}</span>
                  <span className="text-[12px] leading-snug text-ivory/60 sm:text-[12.5px]">{t(r.sub)}</span>
                </dt>
                <dd
                  className={`sa-settle mt-2 whitespace-nowrap font-display font-semibold leading-none text-gold-light num ${lead ? "text-[1.7rem] min-[360px]:text-[2.15rem] sm:text-[3.2rem] lg:text-[4rem]" : "text-[1.5rem] min-[360px]:text-[1.85rem] sm:text-[2.4rem] lg:text-[2.9rem]"}`}
                  style={{ animationDelay: `${120 + i * 110}ms` }}
                >
                  {formatINR(RATES[r.key])}
                  <span className="ml-1 font-sans text-[13px] font-normal text-ivory/60 sm:text-sm">{t("perGram")}</span>
                </dd>
              </div>
            );
          })}
        </dl>
        <div aria-hidden className="h-px bg-gold/45" />
        <p className="mt-3 text-[13px] text-ivory/65">{t("rateNote")}</p>
      </div>
    </section>
  );
}
