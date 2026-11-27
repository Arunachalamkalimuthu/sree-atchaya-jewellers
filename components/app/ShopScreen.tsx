"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/catalog";
import { OFFER, RATES } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useL10n, useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { common } from "@/lib/i18n/dict/common";
import { ShopTile } from "@/components/shop/ShopTile";
import { filterProducts, parseQuery, purityOfCategory } from "@/components/shop/query";
import { AppHeader } from "./AppHeader";

const rateOf = { "22K": RATES.g22, "24K": RATES.g24, "18K": RATES.g18, silver: RATES.silver } as const;

/** The app catalogue: category chips (from ?c=) and a two-column grid of ShopTiles that open the app product screen. */
export function ShopScreen() {
  const t = useT(app);
  const tc = useT(common);
  const l = useL10n();
  const q = parseQuery(useSearchParams());
  const list = filterProducts(PRODUCTS, { ...q, sort: "new" });
  const purity = purityOfCategory(q.cat);
  const chips: { id?: CategoryId; label: string }[] = [{ label: t("shopAll") }, ...CATEGORIES.map((c) => ({ id: c.id, label: l(c) }))];
  const row = useRef<HTMLUListElement>(null);

  useEffect(() => {
    row.current?.querySelector<HTMLElement>("[aria-current]")?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [q.cat]);

  return (
    <>
      <AppHeader title={t("shopTitle")}>
        <nav aria-label={t("shopCategories")} className="mx-auto max-w-xl">
          <ul ref={row} className="flex gap-2 overflow-x-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chips.map((c) => {
              const on = c.id === q.cat;
              return (
                <li key={c.id ?? "all"} className="shrink-0">
                  <Link
                    href={routes.app.shop(c.id)}
                    replace
                    scroll={false}
                    aria-current={on ? "true" : undefined}
                    className={`inline-flex min-h-9 items-center whitespace-nowrap rounded-full border px-3.5 text-[13.5px] transition-colors focus-visible:outline-2 focus-visible:outline-gold ${
                      on ? "border-gold bg-gold text-maroon-deep font-semibold" : "border-gold/40 text-ivory/85 hover:border-gold-light"
                    }`}
                  >
                    {c.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </AppHeader>
      <main className="mx-auto w-full max-w-xl px-4 pb-8 pt-4">
        <div className="flex items-baseline justify-between gap-3 border-b border-gold/40 pb-3">
          <p className="text-[13px] leading-snug text-ink/65 num">
            {t("shopIntro", { purity: purity === "silver" ? tc("rateSilver") : purity, rate: formatINR(rateOf[purity]), wastage: OFFER.wastagePct, gst: OFFER.gstPct })}
          </p>
          <p className="shrink-0 font-display text-[1.05rem] font-semibold text-maroon num" data-testid="shop-count">{t("shopCount", { n: list.length })}</p>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-7">
          {list.map((p) => (
            <li key={p.slug}>
              <ShopTile product={p} href={routes.app.product(p.slug)} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
