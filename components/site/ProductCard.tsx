"use client";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { priceBreakdown, type PriceMode } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { ProductImage } from "@/components/ui/ProductImage";
import { Price } from "@/components/ui/Price";

/**
 * `<ProductCard product mode?>`: the jewel in its arch niche, then name, purity and weight, and today's price
 * (incl. GST). `mode="prebook"` shows the pre-book price with the regular price struck through. No card box,
 * no shadow: the niche is the frame. `href` overrides the link (the app passes routes.app.product).
 */
export function ProductCard({ product: p, mode = "buy", href, className = "" }: { product: Product; mode?: PriceMode; href?: string; className?: string }) {
  const t = useT(common);
  const l = useL10n();
  const prebook = mode === "prebook" && p.prebookable;
  const price = priceBreakdown(p, prebook ? "prebook" : "buy");
  const regular = prebook ? priceBreakdown(p, "buy") : null;
  const name = l(p.name);
  const purity = p.purity === "22K" ? t("purity916") : p.purity === "silver" ? t("rateSilver") : p.purity;

  return (
    <Link href={href ?? routes.product(p.slug)} className={`group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${className}`}>
      <div className="relative">
        <ProductImage src={p.image} alt={name} kind={p.category} className="aspect-[4/5] w-full" />
        {p.isNew && (
          <span className="absolute left-3 top-3 border border-gold/70 bg-maroon-deep/80 px-2 py-0.5 font-display text-[13px] italic text-gold-light">
            {t("newArrival")}
          </span>
        )}
      </div>
      <div className="pt-3.5">
        <h3 className="font-display text-[1.2rem] font-semibold leading-snug text-maroon-deep decoration-gold decoration-1 underline-offset-4 group-hover:underline">
          {name}
        </h3>
        <p className="mt-0.5 text-[13.5px] text-ink/60">
          {purity}, {t("weightG", { g: p.weightG })}
        </p>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5">
          <Price value={price.total} size="md" className="text-maroon" />
          {regular && <Price value={regular.total} size="sm" strike className="text-ink" />}
        </div>
        {prebook && <p className="mt-0.5 text-[13px] text-emerald">{t("prebookOff", { off: price.discountPerGram })}</p>}
      </div>
    </Link>
  );
}
