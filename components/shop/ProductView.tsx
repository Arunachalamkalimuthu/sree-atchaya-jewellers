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
import { BuyBox } from "./BuyBox";
import { ProductGallery } from "./ProductGallery";
import { ShopTile } from "./ShopTile";
import { related } from "./query";

/** The /product/<slug>/ page body: breadcrumb, gallery and BuyBox, then "You may also like" on a maroon band. */
export function ProductView({ slug }: { slug: string }) {
  const t = useT(shop);
  const tc = useT(common);
  const l = useL10n();
  const p = getProduct(slug);
  if (!p) return null;
  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  const more = related(p);
  const gold = p.purity !== "silver";

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 sm:pt-7 lg:px-8">
        <nav aria-label={t("crumbs")}>
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] text-ink/60">
            <li><Link href={routes.shop()} className="rounded-sm hover:text-maroon focus-visible:outline-2 focus-visible:outline-gold">{tc("navJewellery")}</Link></li>
            <li aria-hidden><Icon name="chevron-right" size={14} className="text-gold" /></li>
            <li><Link href={routes.shop(p.category)} className="rounded-sm hover:text-maroon focus-visible:outline-2 focus-visible:outline-gold">{l(cat)}</Link></li>
            <li aria-hidden><Icon name="chevron-right" size={14} className="text-gold" /></li>
            <li aria-current="page" className="text-maroon-deep">{l(p.name)}</li>
          </ol>
        </nav>

        <div className="mt-5 grid gap-x-14 gap-y-8 lg:mt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <ProductGallery product={p} className="lg:sticky lg:top-[132px] lg:self-start" />
          <div>
            <BuyBox product={p} />
            {gold && (
              <p className="mt-8 max-w-[34rem] border-l-2 border-emerald pl-4 text-[14.5px] leading-relaxed text-ink/80 num">
                {t("exchangeLine", { g22: formatINR(PURCHASE_RATES.g22) })}{" "}
                <Link href={routes.sellGold()} className="whitespace-nowrap text-emerald underline decoration-emerald/40 underline-offset-4 hover:decoration-emerald focus-visible:outline-2 focus-visible:outline-gold">
                  {t("sellCta")}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      <section aria-labelledby="also-like" className="bg-maroon text-ivory">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 id="also-like" className="font-display text-[1.9rem] font-semibold leading-tight">{t("alsoLike")}</h2>
            <Link href={routes.shop(p.category)} className="rounded-sm text-[15px] text-gold-light underline decoration-gold/50 underline-offset-4 hover:decoration-gold focus-visible:outline-2 focus-visible:outline-gold">
              {t("viewAll", { category: l(cat) })}
            </Link>
          </div>
          <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {more.map((x) => <li key={x.slug}><ShopTile product={x} dark /></li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
