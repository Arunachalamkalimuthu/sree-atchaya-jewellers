"use client";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { OFFER, RATES, PURCHASE_RATES } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { BANNERS } from "@/lib/images";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { shop } from "@/lib/i18n/dict/shop";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORY_COVERS } from "@/components/home/picks";
import { Filters } from "./Filters";
import { filterProducts, parseQuery, purityOfCategory, toQueryString, type ShopQuery } from "./query";

const RATE_OF = { "22K": RATES.g22, "24K": RATES.g24, "18K": RATES.g18, silver: RATES.silver } as const;
/**
 * The sell-gold banner breaks the grid after a whole number of rows: 12 tiles at 2 and 3 across, 10 at 5 across
 * (1024 px up). Both are rendered and CSS shows the one that fits, so a row is never left half full.
 */
const BREAK_AT = { narrow: 12, wide: 10 } as const;

/** Reads the query from the URL (call inside <Suspense>) and writes changes back with router.replace. */
export function Catalogue() {
  const sp = useSearchParams();
  const router = useRouter();
  const query = useMemo(() => parseQuery(sp), [sp]);
  const onChange = useCallback(
    (q: ShopQuery) => {
      const qs = toQueryString(q);
      router.replace(qs ? `${routes.shop()}?${qs}` : routes.shop(), { scroll: false });
    },
    [router],
  );
  return <CatalogueView query={query} onChange={onChange} />;
}

/** The static shell (Suspense fallback): the full catalogue with no filters. */
export function CatalogueFallback() {
  return <CatalogueView query={{ sort: "new" }} onChange={() => {}} />;
}

function CatalogueView({ query, onChange }: { query: ShopQuery; onChange: (q: ShopQuery) => void }) {
  const t = useT(shop);
  const tc = useT(common);
  const l = useL10n();
  const cat = CATEGORIES.find((c) => c.id === query.cat);
  const base = cat ? PRODUCTS.filter((p) => p.category === cat.id) : PRODUCTS;
  const list = filterProducts(PRODUCTS, query);
  const purity = purityOfCategory(query.cat);
  const purityLabel = purity === "silver" ? tc("rateSilver").toLowerCase() : purity;
  const navRef = useRef<HTMLElement>(null);

  // On phones the category row scrolls sideways: bring the chosen category into view.
  useEffect(() => {
    const nav = navRef.current;
    const on = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (nav && on && nav.scrollWidth > nav.clientWidth) nav.scrollLeft += on.getBoundingClientRect().left - nav.getBoundingClientRect().left - 16;
  }, [query.cat]);

  const wide = list.length > BREAK_AT.wide;
  const narrow = list.length > BREAK_AT.narrow;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6 sm:pt-9 lg:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 className="text-[28px] font-semibold leading-tight text-ink sm:text-[36px]">{cat ? l(cat) : t("allJewellery")}</h1>
        <p className="text-[14px] text-mute" aria-live="polite">
          {list.length === 1 ? t("piecesOne") : t("pieces", { n: list.length })}
        </p>
      </div>
      <p className="mt-1.5 max-w-[68ch] text-[14.5px] leading-relaxed text-mute">
        {t("shopIntro", { purity: purityLabel, rate: formatINR(RATE_OF[purity]), wastage: OFFER.wastagePct, gst: OFFER.gstPct })}
      </p>

      <nav ref={navRef} aria-label={t("categoriesLabel")} className="no-scrollbar -mx-4 mt-6 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <ul className="flex w-max gap-3 pb-1 pt-1 sm:gap-4 lg:grid lg:w-auto lg:grid-cols-11 lg:gap-3">
          {[undefined, ...CATEGORY_COVERS].map((c) => {
            const on = c?.id === query.cat;
            return (
              <li key={c?.id ?? "all"} className="w-[72px] shrink-0 sm:w-[84px] lg:w-auto">
                <Link
                  href={routes.shop(c?.id)}
                  scroll={false}
                  aria-current={on ? "page" : undefined}
                  className="group block rounded-sm text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                >
                  <span className={`block rounded-full p-[3px] transition-shadow ${on ? "ring-2 ring-maroon" : "ring-1 ring-line group-hover:ring-maroon/50"}`}>
                    {c ? (
                      <ProductImage src={c.product?.image ?? ""} alt="" kind={c.id} className="aspect-square w-full rounded-full" />
                    ) : (
                      <AllGlyph />
                    )}
                  </span>
                  <span className={`mt-2 block text-[13px] leading-snug sm:text-[14px] ${on ? "font-semibold text-maroon" : "font-medium text-ink group-hover:text-maroon"}`}>
                    {c ? l(c) : t("catAll")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 border-t border-line pt-5">
        <Filters query={query} onChange={onChange} base={base} resultCount={list.length} />
      </div>

      {list.length === 0 ? (
        <div className="mt-8 max-w-xl rounded-[6px] border border-line bg-white px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-[20px] font-semibold text-ink">{t("noMatch")}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-mute">{t("noMatchHint")}</p>
          <Button variant="maroon" className="mt-5" onClick={() => onChange({ cat: query.cat, sort: query.sort })}>
            {t("clearFilters")}
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-5 lg:gap-x-5">
          {list.map((p, i) => (
            <Fragment key={p.slug}>
              {wide && i === BREAK_AT.wide && <li className="col-span-full hidden py-2 lg:block"><SellBanner /></li>}
              {narrow && i === BREAK_AT.narrow && <li className="col-span-full py-2 lg:hidden"><SellBanner /></li>}
              <li className="min-w-0"><ProductCard product={p} eager={i < 5} /></li>
            </Fragment>
          ))}
          {!wide && <li className="col-span-full hidden pt-2 lg:block"><SellBanner /></li>}
          {!narrow && <li className="col-span-full pt-2 lg:hidden"><SellBanner /></li>}
        </ul>
      )}
    </div>
  );
}

/** "All" in the category row: a soft maroon disc with a small four-square grid, the same size as the photo thumbnails. */
function AllGlyph() {
  return (
    <span className="grid aspect-square w-full place-items-center rounded-full bg-[#F6EDEC] text-maroon">
      <svg aria-hidden viewBox="0 0 24 24" className="w-[36%]" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
      </svg>
    </span>
  );
}

/**
 * Gold and pawn: the shop's buy-back and loan-release desk, as a photo promo banner. The copy is longer than a home
 * promo, so the text column is widened (the Banner's inner text box) from 640 px up.
 */
function SellBanner() {
  const t = useT(shop);
  return (
    <Banner
      src={BANNERS.oldgold}
      focal="78% 50%"
      className="h-[380px] rounded-[6px] sm:h-[280px] lg:h-[270px] [&>div>div]:max-w-none sm:[&>div>div]:max-w-[31rem]"
      headline={t("sellTitle")}
      detail={t("sellBody", { g22: formatINR(PURCHASE_RATES.g22), g18: formatINR(PURCHASE_RATES.g18) })}
      action={(photo) => (
        <div className="flex flex-wrap gap-3">
          <Button href={routes.sellGold()} variant={photo ? "light" : "maroon"}>{t("sellCta")}</Button>
          <Button href={routes.custom()} variant={photo ? "ghost-light" : "ghost"}>{t("customCta")}</Button>
        </div>
      )}
    />
  );
}
