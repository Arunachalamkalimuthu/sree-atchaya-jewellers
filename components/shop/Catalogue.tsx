"use client";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { RATES, PURCHASE_RATES } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { shop } from "@/lib/i18n/dict/shop";
import { Button } from "@/components/ui/Button";
import { Filters } from "./Filters";
import { ShopTile } from "./ShopTile";
import { filterProducts, parseQuery, purityOfCategory, toQueryString, type ShopQuery } from "./query";

const RATE_OF = { "22K": RATES.g22, "24K": RATES.g24, "18K": RATES.g18, silver: RATES.silver } as const;
/** The sell-gold strip breaks the grid after this many tiles (a whole number of rows at 2, 3 and 4 columns). */
const BREAK_AT = 12;

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

  return (
    <>
      <section className="bg-maroon text-ivory">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h1 className="font-display text-[2.1rem] font-semibold leading-tight sm:text-[2.6rem]">{cat ? l(cat) : t("allJewellery")}</h1>
            <p className="text-[14px] text-gold-light num" aria-live="polite">
              {list.length === 1 ? t("piecesOne") : t("pieces", { n: list.length })}
            </p>
          </div>
          <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-ivory/80">
            {t("shopIntro", { purity: purityLabel, rate: formatINR(RATE_OF[purity]) })}
          </p>

          <nav ref={navRef} aria-label={t("categoriesLabel")} className="-mx-4 mt-6 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <ul className="flex min-w-max gap-1 border-b border-gold/40">
              {[undefined, ...CATEGORIES].map((c) => {
                const on = c?.id === query.cat;
                return (
                  <li key={c?.id ?? "all"}>
                    <Link
                      href={routes.shop(c?.id)}
                      scroll={false}
                      aria-current={on ? "page" : undefined}
                      className={`relative block whitespace-nowrap rounded-t-sm px-3 pb-3 pt-1 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-gold ${
                        on ? "text-gold-light" : "text-ivory/75 hover:text-ivory"
                      }`}
                    >
                      {c ? l(c) : t("catAll")}
                      {on && <span aria-hidden className="absolute inset-x-3 -bottom-px h-[2px] bg-gold" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <Filters query={query} onChange={onChange} base={base} resultCount={list.length} />

        {list.length === 0 ? (
          <div className="mt-12 max-w-lg border-l-2 border-gold pl-5">
            <p className="font-display text-2xl font-semibold text-maroon">{t("noMatch")}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{t("noMatchHint")}</p>
            <Button variant="maroon" className="mt-5" onClick={() => onChange({ cat: query.cat, sort: query.sort })}>
              {t("clearFilters")}
            </Button>
          </div>
        ) : (
          <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-11">
            {list.map((p, i) => (
              <Fragment key={p.slug}>
                {i === BREAK_AT && <li className="col-span-full"><SellStrip /></li>}
                <li><ShopTile product={p} /></li>
              </Fragment>
            ))}
            {list.length <= BREAK_AT && <li className="col-span-full mt-2"><SellStrip /></li>}
          </ul>
        )}
      </section>
    </>
  );
}

/** Gold and pawn: the shop's buy-back and loan-release desk, on emerald like their sell-gold posters. */
function SellStrip() {
  const t = useT(shop);
  return (
    <div className="bg-emerald text-ivory">
      <div className="flex flex-col gap-5 px-6 py-7 sm:px-9 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-[60ch]">
          <h2 className="font-display text-[1.6rem] font-semibold leading-tight">{t("sellTitle")}</h2>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ivory/85 num">
            {t("sellBody", { g22: formatINR(PURCHASE_RATES.g22), g18: formatINR(PURCHASE_RATES.g18) })}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button href={routes.sellGold()} variant="gold">{t("sellCta")}</Button>
          <Button href={routes.custom()} variant="ghost" className="text-ivory! hover:bg-ivory/10">{t("customCta")}</Button>
        </div>
      </div>
    </div>
  );
}
