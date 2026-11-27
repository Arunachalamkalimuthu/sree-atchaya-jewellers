"use client";
import { OFFER } from "@/lib/site.config";
import { useT } from "@/lib/i18n";
import { checkout } from "@/lib/i18n/dict/checkout";
import { common } from "@/lib/i18n/dict/common";
import { Price } from "@/components/ui/Price";

/** The summary card: order value, advance on pre-book items, pay now, balance. */
export function Totals({ total, advance, payNow, children }: { total: number; advance: number; payNow: number; children?: React.ReactNode }) {
  const t = useT(checkout);
  const c = useT(common);
  const balance = total - payNow;
  return (
    <aside className="rounded-[6px] border border-line bg-white p-5 sm:p-6">
      <h2 className="text-[20px] font-semibold text-ink">{t("sumTitle")}</h2>
      <dl className="mt-5 space-y-3 text-[15px]">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-mute">{t("sumValue")}</dt>
          <dd><Price value={total} size="md" className="text-ink" /></dd>
        </div>
        {advance > 0 && (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-mute">{t("sumAdvance", { pct: OFFER.prebookAdvancePct })}</dt>
            <dd><Price value={advance} size="md" className="text-ink" /></dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
          <dt className="text-[16px] font-semibold text-ink">{t("sumPayNow")}</dt>
          <dd><Price value={payNow} size="lg" className="text-maroon" /></dd>
        </div>
        {balance > 0 && (
          <div className="flex items-baseline justify-between gap-4 text-mute">
            <dt>{t("sumBalance")}</dt>
            <dd><Price value={balance} size="sm" className="text-ink" /></dd>
          </div>
        )}
      </dl>
      <p className="mt-4 text-[13px] text-mute">{c("priceInclGst")}</p>
      {children && <div className="mt-6 space-y-3">{children}</div>}
    </aside>
  );
}
