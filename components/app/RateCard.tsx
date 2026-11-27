"use client";
import { RATES, SITE } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { formatDate, formatTime, useLang, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";

const ROWS = [
  { key: "g22", label: "rateGold22" },
  { key: "g24", label: "rateGold24" },
  { key: "g18", label: "rateGold18" },
  { key: "silver", label: "rateSilver" },
] as const;

/**
 * `<RateCard />`: today's rates as a slim maroon card for the app home: 22K, 24K, 18K and silver per gram in
 * gold numerals, with the date and time from SITE. The numerals settle in once on load (off under reduced motion).
 */
export function RateCard({ className = "" }: { className?: string }) {
  const t = useT(common);
  const [lang] = useLang();
  const stamp = { date: formatDate(SITE.ratesDate, lang, { year: false }), time: formatTime(SITE.ratesTime, lang) };

  return (
    <section aria-labelledby="app-rate-title" className={`rounded-[12px] bg-maroon px-4 pb-3 pt-3.5 text-white ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="app-rate-title" className="text-[15px] font-semibold leading-tight">{t("rateBoardTitle")}</h2>
        <p className="shrink-0 text-[12px] text-white/70">{t("rateStamp", stamp)}</p>
      </div>
      <dl className="mt-2.5 grid grid-cols-4 border-t border-gold/35 pt-2.5">
        {ROWS.map((r, i) => (
          <div key={r.key} className={`min-w-0 ${i > 0 ? "border-l border-white/15 pl-2.5" : "pr-1"}`}>
            <dt className="text-[12px] leading-tight text-white/70">{t(r.label)}</dt>
            <dd
              className="sa-settle mt-0.5 whitespace-nowrap text-[16px] font-semibold leading-tight text-gold-light num min-[380px]:text-[17px]"
              style={{ animationDelay: `${100 + i * 90}ms` }}
            >
              {formatINR(RATES[r.key])}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-[11.5px] leading-snug text-white/60">{t("rateNote")}</p>
    </section>
  );
}
