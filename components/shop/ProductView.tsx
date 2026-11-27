"use client";
import Link from "next/link";
import { CATEGORIES, getProduct } from "@/lib/catalog";
import { PURCHASE_RATES } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { shop } from "@/lib/i18n/dict/shop";
import { Icon } from "@/components/ui/Icon";
import { ProductRow } from "@/components/home/ProductRow";
import { BuyBox } from "./BuyBox";
import { ProductGallery } from "./ProductGallery";
import { related } from "./query";

/** The /product/<slug>/ page body: breadcrumb, the square gallery and BuyBox, then "You may also like" as a white product row. */
export function ProductView({ slug }: { slug: string }) {
  const t = useT(shop);
  const tc = useT(common);
  const l = useL10n();
  const p = getProduct(slug);
  if (!p) return null;
  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  // Five, to fill the five-across row (related() defaults to four).
  const more = related(p, 5);
  // Old-gold buy-back applies to gold jewellery only, not coins (24K) or silver.
  const gold = p.purity === "22K" || p.purity === "18K";
  const crumb = "rounded-sm hover:text-maroon focus-visible:outline-2 focus-visible:outline-gold";

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-14">
        <nav aria-label={t("crumbs")}>
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13.5px] text-mute">
            <li><Link href={routes.shop()} className={crumb}>{tc("navJewellery")}</Link></li>
            <li aria-hidden><Icon name="chevron-right" size={14} className="text-mute/70" /></li>
            <li><Link href={routes.shop(p.category)} className={crumb}>{l(cat)}</Link></li>
            <li aria-hidden><Icon name="chevron-right" size={14} className="text-mute/70" /></li>
            <li aria-current="page" className="text-ink">{l(p.name)}</li>
          </ol>
        </nav>

        <div className="mt-5 grid gap-x-12 gap-y-8 lg:mt-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:gap-x-16">
          <ProductGallery product={p} className="lg:sticky lg:top-[132px] lg:self-start" />
          <div>
            <BuyBox product={p} />
            {gold && (
              <p className="mt-8 max-w-[34rem] rounded-[6px] border border-line bg-cream px-4 py-3.5 text-[14.5px] leading-relaxed text-ink">
                {t("exchangeLine", { g22: formatINR(PURCHASE_RATES.g22) })}{" "}
                <Link href={routes.sellGold()} className="whitespace-nowrap font-semibold text-maroon underline decoration-maroon/35 underline-offset-4 hover:decoration-maroon focus-visible:outline-2 focus-visible:outline-gold">
                  {t("sellCta")}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <ProductRow
          id="also-like"
          title={t("alsoLike")}
          link={{ href: routes.shop(p.category), label: t("viewAll", { category: l(cat) }) }}
          products={more}
          className="pb-14 sm:pb-16"
        />
      </div>
    </>
  );
}
