"use client";
import type { PriceBreakdown, PriceMode } from "@/lib/pricing";
import type { Purity } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";

/**
 * `<PriceBreakdownTable breakdown mode>`: weight × rate, wastage (சேதாரம்) 0%, making (செய்கூலி), stones, GST 3%, total;
 * in pre-book mode also the ₹540/g offer, the 10% advance and the balance. Pass `purity` for silver wording.
 */
export function PriceBreakdownTable({ breakdown: b, mode, purity, className = "" }: { breakdown: PriceBreakdown; mode: PriceMode; purity?: Purity; className?: string }) {
  const t = useT(common);
  const silver = purity === "silver";
  const prebook = mode === "prebook";

  const rows: { label: string; value: string; muted?: boolean }[] = [
    { label: silver ? t("bdRateSilver") : t("bdRate"), value: `${formatINR(b.ratePerGram + b.discountPerGram)}${t("perGram")}` },
    ...(prebook && b.discountPerGram ? [{ label: t("bdOffer"), value: t("bdOfferValue", { off: b.discountPerGram }) }] : []),
    { label: t("bdWeight"), value: t("weightG", { g: b.weightG }) },
    { label: silver ? t("bdSilverValue") : t("bdGoldValue"), value: formatINR(b.metalValue) },
    { label: t("bdWastage"), value: formatINR(b.wastage) },
    { label: t("bdMaking"), value: prebook ? t("bdMakingWaived") : formatINR(b.making), muted: prebook },
    ...(b.stone ? [{ label: t("bdStone"), value: formatINR(b.stone) }] : []),
    { label: t("bdSubtotal"), value: formatINR(b.subtotal) },
    { label: t("bdGst"), value: formatINR(b.gst) },
  ];

  return (
    <div className={className}>
      <table className="w-full border-collapse text-[15px]">
        <caption className="mb-2 text-left font-display text-xl font-semibold text-maroon">{t("bdTitle")}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-gold/30">
              <th scope="row" className="py-2.5 pr-4 text-left font-normal text-ink/75">{r.label}</th>
              <td className={`py-2.5 text-right num ${r.muted ? "text-emerald" : "text-ink"}`}>{r.value}</td>
            </tr>
          ))}
          <tr className="border-b-2 border-maroon/70">
            <th scope="row" className="pb-3 pt-4 pr-4 text-left font-display text-xl font-semibold text-maroon">{t("bdTotal")}</th>
            <td className="pb-3 pt-4 text-right font-display text-[1.75rem] font-semibold leading-none text-maroon num">{formatINR(b.total)}</td>
          </tr>
          {prebook && b.advance > 0 && (
            <>
              <tr className="bg-maroon text-ivory">
                <th scope="row" className="px-3 py-3 text-left font-medium">{t("bdAdvance")}</th>
                <td className="px-3 py-3 text-right font-display text-[1.4rem] font-semibold text-gold-light num">{formatINR(b.advance)}</td>
              </tr>
              <tr>
                <th scope="row" className="px-3 py-2.5 text-left font-normal text-ink/70">{t("bdBalance")}</th>
                <td className="px-3 py-2.5 text-right text-ink num">{formatINR(b.total - b.advance)}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
