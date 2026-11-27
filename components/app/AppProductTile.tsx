"use client";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { formatINR, priceBreakdown } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { shop } from "@/lib/i18n/dict/shop";
import { AppPhoto } from "./AppPhoto";

/** App catalogue tile: square photo on white, name, purity and weight in grey, today's price in maroon. */
export function AppProductTile({ product: p, className = "" }: { product: Product; className?: string }) {
  const t = useT(shop);
  const tc = useT(common);
  const l = useL10n();
  const name = l(p.name);
  const buy = priceBreakdown(p, "buy");
  const pre = p.prebookable ? priceBreakdown(p, "prebook") : null;
  const purity = p.purity === "22K" ? tc("purity916") : p.purity === "silver" ? tc("rateSilver") : p.purity;
  return (
    <Link href={routes.app.product(p.slug)} className={`group block rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}>
      <div className="relative overflow-hidden rounded-[10px] border border-[#ECE6DF]">
        <AppPhoto src={p.image} alt={name} kind={p.category} className="aspect-square w-full" />
        {p.isNew && <span className="absolute left-2 top-2 rounded-[3px] bg-maroon px-1.5 py-0.5 text-[11px] font-semibold leading-tight text-white">{tc("newArrival")}</span>}
      </div>
      <h3 className="mt-2 line-clamp-2 text-[14px] font-medium leading-snug text-ink">{name}</h3>
      <p className="mt-0.5 text-[12.5px] text-[#6B5E57]">{purity}, {tc("weightG", { g: p.weightG })}</p>
      <p className="mt-1 text-[16px] font-semibold text-maroon num">{formatINR(buy.total)}</p>
      {pre && <p className="text-[12px] text-[#6B5E57] num">{t("tilePrebook", { amount: formatINR(pre.total) })}</p>}
    </Link>
  );
}
