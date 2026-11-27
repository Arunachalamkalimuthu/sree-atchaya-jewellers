"use client";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, type Product } from "@/lib/catalog";
import { priceBreakdown } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { Sheet } from "@/components/ui/Sheet";
import { ProductImage } from "@/components/ui/ProductImage";
import { Price } from "@/components/ui/Price";
import { Icon } from "@/components/ui/Icon";

const norm = (s: string) => s.toLocaleLowerCase("en-IN").normalize("NFC").trim();

/** Products whose English or Tamil name (or category name) contains every word typed. */
export function searchProducts(q: string): Product[] {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return PRODUCTS.filter((p) => {
    const c = CATEGORIES.find((x) => x.id === p.category);
    const hay = norm(`${p.name.en} ${p.name.ta} ${c?.en ?? ""} ${c?.ta ?? ""} ${p.purity}`);
    return words.every((w) => hay.includes(w));
  });
}

/** `<SearchSheet open onClose>`: search the catalogue by name, in either language. Results link to the product page. */
export function SearchSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return open ? <Inner onClose={onClose} /> : null;
}

function Inner({ onClose }: { onClose: () => void }) {
  const t = useT(common);
  const l = useL10n();
  const id = useId();
  const [q, setQ] = useState("");
  const results = useMemo(() => searchProducts(q).slice(0, 8), [q]);

  return (
    <Sheet open onClose={onClose} title={t("searchTitle")} width="lg">
      <label htmlFor={id} className="sr-only">{t("searchLabel")}</label>
      <div className="relative">
        <Icon name="search" size={19} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
        <input
          id={id}
          type="search"
          data-autofocus
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-12 w-full rounded-[4px] border border-line bg-white pl-10 pr-3 text-[16px] text-ink placeholder:text-mute/70 focus-visible:border-maroon/50 focus-visible:outline-2 focus-visible:outline-gold"
        />
      </div>

      <div aria-live="polite" className="mt-4">
        {!q.trim() ? (
          <div>
            <p className="text-[13px] text-mute">{t("searchHint")}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href={routes.shop(c.id)} onClick={onClose} className="inline-flex min-h-9 items-center rounded-full border border-line px-3.5 text-[14px] text-ink hover:border-maroon/40 hover:text-maroon focus-visible:outline-2 focus-visible:outline-gold">
                    {l(c)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : results.length === 0 ? (
          <p className="py-6 text-center text-[15px] text-mute">{t("searchNone", { q: q.trim() })}</p>
        ) : (
          <ul className="divide-y divide-line">
            {results.map((p) => (
              <li key={p.slug}>
                <Link href={routes.product(p.slug)} onClick={onClose} className="flex items-center gap-3.5 py-2.5 hover:bg-cream focus-visible:outline-2 focus-visible:outline-gold">
                  <ProductImage src={p.image} alt="" kind={p.category} className="size-14 shrink-0 rounded-[3px]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium text-ink">{l(p.name)}</span>
                    <span className="block text-[12.5px] text-mute">{p.purity === "22K" ? t("purity916") : p.purity === "silver" ? t("rateSilver") : p.purity}, {t("weightG", { g: p.weightG })}</span>
                  </span>
                  <Price value={priceBreakdown(p, "buy").total} size="sm" className="shrink-0 text-maroon" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Sheet>
  );
}
