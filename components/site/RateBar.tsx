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
 * - `compact` (the site layout): the slim rate ticker above the header. Same as `<RateTicker />`.
 * - otherwise: the compact rate card, same as `<RateBoard />`.
 */
export function RateBar({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return compact ? <RateTicker className={className} /> : <RateBoard className={className} />;
}

/**
 * `<RateTicker />`: one slim maroon-deep line above the header. "Today's rate, 26 Nov 2026, 10:00 AM" and the four
 * rates with gold numerals. On phones the date sits on its own short line above the rates.
 */
export function RateTicker({ className = "" }: { className?: string }) {
  const t = useT(common);
  const stamp = useStamp();
  return (
    <div className={`bg-maroon-deep text-white ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-0.5 px-4 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-8">
        <p className="text-[11px] leading-tight text-white/70 sm:text-[12.5px]">{t("rateStripLabel", stamp)}</p>
        <dl className="flex items-baseline justify-between gap-x-3 sm:justify-end sm:gap-x-5">
          {ROWS.map((r) => (
            <div key={r.key} className="flex items-baseline gap-1.5 whitespace-nowrap">
              <dt className="text-[11.5px] leading-tight text-white/75 sm:text-[12.5px]">{t(r.label)}</dt>
              <dd className="text-[12.5px] font-semibold leading-tight text-gold-light tabular-nums sm:text-[13.5px]">
                {formatINR(RATES[r.key])}<span className="font-normal text-white/55 max-[400px]:hidden">{t("perGram")}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/**
 * `<RateBoard />`: a compact rate card (white, fine border) for the app home or any page that wants the rates in
 * the body. The website home no longer uses it: the ticker carries the rates there.
 */
export function RateBoard({ className = "" }: { className?: string }) {
  const t = useT(common);
  const stamp = useStamp();
  return (
    <section aria-labelledby="rate-board-title" className={`rounded-[6px] border border-line bg-white ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-line px-4 py-3 sm:px-5">
        <h2 id="rate-board-title" className="text-[16px] font-semibold text-ink">{t("rateBoardTitle")}</h2>
        <p className="text-[12.5px] text-mute">{t("rateStamp", stamp)}</p>
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-4">
        {ROWS.map((r, i) => (
          <div key={r.key} className={`px-4 py-3 sm:px-5 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}>
            <dt className="text-[12.5px] leading-snug text-mute">
              <span className="font-semibold text-ink">{t(r.label)}</span> {t(r.sub)}
            </dt>
            <dd className="mt-0.5 whitespace-nowrap text-[20px] font-semibold leading-tight text-maroon tabular-nums">
              {formatINR(RATES[r.key])}<span className="ml-0.5 text-[12.5px] font-normal text-mute">{t("perGram")}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-line px-4 py-2 text-[12px] text-mute sm:px-5">{t("rateNote")}</p>
    </section>
  );
}
