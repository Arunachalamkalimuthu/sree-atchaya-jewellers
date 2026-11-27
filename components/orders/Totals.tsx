"use client";
import { OFFER } from "@/lib/site.config";
import { useT } from "@/lib/i18n";
import { checkout } from "@/lib/i18n/dict/checkout";
import { common } from "@/lib/i18n/dict/common";
import { Price } from "@/components/ui/Price";

/** The maroon summary panel: order value, advance on pre-book items, pay now, balance. */
export function Totals({ total, advance, payNow, children }: { total: number; advance: number; payNow: number; children?: React.ReactNode }) {
  const t = useT(checkout);
  const c = useT(common);
  const balance = total - payNow;
  return (
    <aside className="border border-gold/60 bg-maroon p-6 text-ivory sm:p-7">
      <h2 className="font-display text-2xl font-semibold text-gold-light">{t("sumTitle")}</h2>
      <dl className="mt-5 space-y-3 text-[15px]">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-ivory/80">{t("sumValue")}</dt>
          <dd><Price value={total} size="md" className="text-ivory" /></dd>
        </div>
        {advance > 0 && (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-ivory/80">{t("sumAdvance", { pct: OFFER.prebookAdvancePct })}</dt>
            <dd><Price value={advance} size="md" className="text-ivory" /></dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-4 border-t border-gold/50 pt-4">
          <dt className="font-display text-xl font-semibold text-gold-light">{t("sumPayNow")}</dt>
          <dd><Price value={payNow} size="lg" className="text-gold-light" /></dd>
        </div>
        {balance > 0 && (
          <div className="flex items-baseline justify-between gap-4 text-ivory/80">
            <dt>{t("sumBalance")}</dt>
            <dd><Price value={balance} size="sm" className="text-ivory/90" /></dd>
          </div>
        )}
      </dl>
      <p className="mt-4 text-[13px] text-ivory/65">{c("priceInclGst")}</p>
      {children && <div className="mt-6 space-y-3">{children}</div>}
    </aside>
  );
}
