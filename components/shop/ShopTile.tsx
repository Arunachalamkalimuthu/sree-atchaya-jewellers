"use client";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { formatINR, priceBreakdown } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { shop } from "@/lib/i18n/dict/shop";
import { ProductImage } from "@/components/ui/ProductImage";
import { Price } from "@/components/ui/Price";
import { nicheTone } from "./query";

/**
 * Catalogue tile. Like ProductCard, but the niche tone follows the piece (maroon bust or light tray) and the
 * price line carries the tile: today's price large, the pre-book price under it in emerald.
 * `dark` sets the caption for a maroon band. `href` overrides the link (the app passes routes.app.product).
 */
export function ShopTile({ product: p, href, dark = false, className = "" }: { product: Product; href?: string; dark?: boolean; className?: string }) {
  const t = useT(shop);
  const tc = useT(common);
  const l = useL10n();
  const name = l(p.name);
  const buy = priceBreakdown(p, "buy");
  const pre = p.prebookable ? priceBreakdown(p, "prebook") : null;
  const purity = p.purity === "22K" ? tc("purity916") : p.purity === "silver" ? tc("rateSilver") : p.purity;

  return (
    <Link href={href ?? routes.product(p.slug)} className={`group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${className}`}>
      <div className="relative">
        <ProductImage src={p.image} alt={name} kind={p.category} tone={dark ? "ivory" : nicheTone(p.category)} className="aspect-[4/5] w-full" />
        {p.isNew && (
          <span className="absolute left-2.5 top-2.5 border border-gold/70 bg-maroon-deep/85 px-2 py-0.5 font-display text-[13px] font-semibold leading-tight text-gold-light">
            {tc("newArrival")}
          </span>
        )}
      </div>
      <div className="pt-3">
        <h3
          className={`font-display text-[1.1rem] font-semibold leading-snug decoration-gold decoration-1 underline-offset-4 group-hover:underline sm:text-[1.2rem] ${
            dark ? "text-ivory" : "text-maroon-deep"
          }`}
        >
          {name}
        </h3>
        <p className={`mt-0.5 text-[13px] ${dark ? "text-ivory/65" : "text-ink/60"}`}>
          {purity}, {tc("weightG", { g: p.weightG })}
        </p>
        <Price value={buy.total} size="md" className={`mt-1 block sm:text-[1.4rem] ${dark ? "text-gold-light" : "text-maroon"}`} />
        {pre && (
          <p className={`text-[13px] num ${dark ? "text-gold-light/75" : "text-emerald"}`}>{t("tilePrebook", { amount: formatINR(pre.total) })}</p>
        )}
      </div>
    </Link>
  );
}
