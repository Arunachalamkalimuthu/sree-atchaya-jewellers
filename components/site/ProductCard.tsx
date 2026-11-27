"use client";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { priceBreakdown, type PriceMode } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { ProductImage } from "@/components/ui/ProductImage";
import { Price } from "@/components/ui/Price";
import { Icon } from "@/components/ui/Icon";
import { useWishlist } from "./useWishlist";

/**
 * `<ProductCard product mode? href? wishlist? eager?>`: the v2 white tile. A square photo (zooms a little on hover,
 * photo only), a small solid maroon "New" tag, an optional wishlist heart (localStorage "sa-wish"), then the name,
 * purity and weight in grey, and today's price incl. GST in maroon. `mode="prebook"` shows the pre-book price with
 * the regular price struck through. `href` overrides the link (the app passes routes.app.product).
 */
export function ProductCard({
  product: p, mode = "buy", href, wishlist = true, eager = false, className = "",
}: { product: Product; mode?: PriceMode; href?: string; wishlist?: boolean; eager?: boolean; className?: string }) {
  const t = useT(common);
  const l = useL10n();
  const wish = useWishlist();
  const prebook = mode === "prebook" && p.prebookable;
  const price = priceBreakdown(p, prebook ? "prebook" : "buy");
  const regular = prebook ? priceBreakdown(p, "buy") : null;
  const name = l(p.name);
  const purity = p.purity === "22K" ? t("purity916") : p.purity === "silver" ? t("rateSilver") : p.purity;
  const saved = wish.has(p.slug);

  return (
    <div className={`group relative ${className}`}>
      <Link href={href ?? routes.product(p.slug)} className="block rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
        <div className="relative overflow-hidden rounded-[4px] border border-line">
          <ProductImage src={p.image} alt={name} kind={p.category} zoom eager={eager} className="aspect-square w-full" />
          {p.isNew && (
            <span className="absolute left-2 top-2 rounded-[3px] bg-maroon px-2 py-[3px] text-[11.5px] font-semibold leading-none text-white">
              {t("newArrival")}
            </span>
          )}
        </div>
        <div className="pt-3">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-ink group-hover:text-maroon">{name}</h3>
          <p className="mt-0.5 text-[13px] text-mute">
            {purity}, {t("weightG", { g: p.weightG })}
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <Price value={price.total} size="md" className="text-maroon" />
            {regular && <Price value={regular.total} size="sm" strike className="text-mute" />}
          </div>
          {prebook && <p className="text-[12.5px] text-emerald">{t("prebookOff", { off: price.discountPerGram })}</p>}
        </div>
      </Link>
      {wishlist && (
        <button
          type="button"
          onClick={() => wish.toggle(p.slug)}
          aria-pressed={saved}
          aria-label={t(saved ? "wishRemove" : "wishAdd", { name })}
          className="absolute right-1.5 top-1.5 grid size-9 place-items-center rounded-full bg-white/90 text-maroon transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-gold"
        >
          <Icon name="heart" size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      )}
    </div>
  );
}
