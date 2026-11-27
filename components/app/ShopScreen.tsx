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
import { filterProducts, parseQuery, purityOfCategory } from "@/components/shop/query";
import { AppHeader } from "./AppHeader";
import { AppPhoto } from "./AppPhoto";
import { AppProductTile } from "./AppProductTile";
import { AppIcon } from "./AppIcons";
import { useHasPhoto } from "./photos";

const rateOf = { "22K": RATES.g22, "24K": RATES.g24, "18K": RATES.g18, silver: RATES.silver } as const;

// Coins have no product photo yet; the coin banner stands in for the thumbnail.
const CHIP_FALLBACK: Partial<Record<CategoryId, string>> = { coin: "/images/banners/hero-coins.jpg" };

/**
 * The app catalogue: a row of round category thumbnails (from ?c=), each the first photographed piece of that
 * category, then a two-column grid of AppProductTiles that open the app product screen.
 */
export function ShopScreen() {
  const t = useT(app);
  const tc = useT(common);
  const l = useL10n();
  const has = useHasPhoto();
  const q = parseQuery(useSearchParams());
  const list = filterProducts(PRODUCTS, { ...q, sort: "new" });
  const purity = purityOfCategory(q.cat);
  const row = useRef<HTMLUListElement>(null);

  const chips: { id?: CategoryId; label: string; src: string }[] = [
    { label: t("shopAll"), src: "" },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      label: l(c),
      src: PRODUCTS.find((p) => p.category === c.id && has(p.image))?.image ?? CHIP_FALLBACK[c.id] ?? "",
    })),
  ];

  useEffect(() => {
    row.current?.querySelector<HTMLElement>("[aria-current]")?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [q.cat]);

  return (
    <>
      <AppHeader title={t("shopTitle")} />
      <nav aria-label={t("shopCategories")} className="mx-auto w-full max-w-xl border-b border-[#ECE6DF]">
        <ul ref={row} className="flex gap-1 overflow-x-auto px-2 pb-3 pt-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chips.map((c) => {
            const on = c.id === q.cat;
            return (
              <li key={c.id ?? "all"} className="w-[76px] shrink-0">
                <Link
                  href={routes.app.shop(c.id)}
                  replace
                  scroll={false}
                  aria-current={on ? "true" : undefined}
                  className="flex flex-col items-center gap-1.5 rounded-[10px] px-1 py-0.5 focus-visible:outline-2 focus-visible:outline-maroon"
                >
                  <span className={`block rounded-full p-[2px] ${on ? "ring-2 ring-maroon" : "ring-1 ring-[#ECE6DF]"}`}>
                    {c.id ? (
                      <AppPhoto src={c.src} alt="" kind={c.id} round className="size-[58px]" />
                    ) : (
                      <span className="grid size-[58px] place-items-center rounded-full bg-[#F6EDEC] text-maroon">
                        <AppIcon name="shop" size={26} strokeWidth={1.4} />
                      </span>
                    )}
                  </span>
                  <span className={`line-clamp-2 w-full text-center text-[12px] leading-[1.2] ${on ? "font-semibold text-maroon" : "text-ink"}`}>{c.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <main className="mx-auto w-full max-w-xl px-4 pb-8 pt-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[12.5px] leading-snug text-[#6B5E57] num">
            {t("shopIntro", { purity: purity === "silver" ? tc("rateSilver") : purity, rate: formatINR(rateOf[purity]), wastage: OFFER.wastagePct, gst: OFFER.gstPct })}
          </p>
          <p className="shrink-0 text-[14px] font-semibold text-ink num" data-testid="shop-count">{t("shopCount", { n: list.length })}</p>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6">
          {list.map((p) => (
            <li key={p.slug}>
              <AppProductTile product={p} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
