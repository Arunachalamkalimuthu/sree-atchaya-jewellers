"use client";
import type { PriceBreakdown, PriceMode } from "@/lib/pricing";
import type { Purity } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";

/**
 * `<PriceBreakdownTable breakdown mode purity?>`: weight × rate, wastage (சேதாரம்) 0%, making (செய்கூலி), stones, GST 3%
 * and the total; in pre-book mode also the ₹540/g offer, the 10% advance and the balance. Pass `purity` for silver
 * wording. A plain bordered table on white: grey labels, ink values, the total in maroon, the advance on a warm
 * off-white row.
 */
export function PriceBreakdownTable({ breakdown: b, mode, purity, className = "" }: { breakdown: PriceBreakdown; mode: PriceMode; purity?: Purity; className?: string }) {
  const t = useT(common);
  const silver = purity === "silver";
  const prebook = mode === "prebook";

  const rows: { label: string; value: string; note?: boolean }[] = [
    { label: silver ? t("bdRateSilver") : t("bdRate"), value: `${formatINR(b.ratePerGram + b.discountPerGram)}${t("perGram")}` },
    ...(prebook && b.discountPerGram ? [{ label: t("bdOffer"), value: t("bdOfferValue", { off: b.discountPerGram }), note: true }] : []),
    { label: t("bdWeight"), value: t("weightG", { g: b.weightG }) },
    { label: silver ? t("bdSilverValue") : t("bdGoldValue"), value: formatINR(b.metalValue) },
    { label: t("bdWastage"), value: formatINR(b.wastage) },
    { label: t("bdMaking"), value: prebook ? t("bdMakingWaived") : formatINR(b.making), note: prebook },
    ...(b.stone ? [{ label: t("bdStone"), value: formatINR(b.stone) }] : []),
    { label: t("bdSubtotal"), value: formatINR(b.subtotal) },
    { label: t("bdGst"), value: formatINR(b.gst) },
  ];
  const cell = "px-4 sm:px-5";

  return (
    <div className={`overflow-hidden rounded-[6px] border border-line bg-white ${className}`}>
      <table className="w-full border-collapse text-[14.5px]">
        <caption className={`${cell} border-b border-line bg-cream py-3 text-left text-[16px] font-semibold text-ink`}>{t("bdTitle")}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-line last:border-b-0">
              <th scope="row" className={`${cell} py-2.5 text-left font-normal text-mute`}>{r.label}</th>
              <td className={`${cell} py-2.5 text-right tabular-nums ${r.note ? "font-medium text-maroon" : "text-ink"}`}>{r.value}</td>
            </tr>
          ))}
          <tr className="border-t border-ink/15">
            <th scope="row" className={`${cell} py-3.5 text-left text-[16px] font-semibold text-ink`}>{t("bdTotal")}</th>
            <td className={`${cell} py-3.5 text-right text-[22px] font-semibold leading-none text-maroon tabular-nums`}>{formatINR(b.total)}</td>
          </tr>
          {prebook && b.advance > 0 && (
            <>
              <tr className="border-t border-line bg-cream">
                <th scope="row" className={`${cell} py-3 text-left font-semibold text-ink`}>{t("bdAdvance")}</th>
                <td className={`${cell} py-3 text-right text-[18px] font-semibold text-maroon tabular-nums`}>{formatINR(b.advance)}</td>
              </tr>
              <tr className="border-t border-line">
                <th scope="row" className={`${cell} py-2.5 text-left font-normal text-mute`}>{t("bdBalance")}</th>
                <td className={`${cell} py-2.5 text-right text-ink tabular-nums`}>{formatINR(b.total - b.advance)}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
