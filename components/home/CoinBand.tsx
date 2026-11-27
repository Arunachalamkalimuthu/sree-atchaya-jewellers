"use client";
import Link from "next/link";
import { useState } from "react";
import { OFFER } from "@/lib/site.config";
import { PRODUCTS } from "@/lib/catalog";
import { priceBreakdown } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { home } from "@/lib/i18n/dict/home";
import { Button } from "@/components/ui/Button";
import { ContactSheet } from "@/components/ui/ContactSheet";
import { ProductImage } from "@/components/ui/ProductImage";
import { Price } from "@/components/ui/Price";

const COINS = PRODUCTS.filter((p) => p.category === "coin").sort((a, b) => a.weightG - b.weightG);

/** Gold coin offer: the coin prices from priceBreakdown beside the coin photos, the coin desk in a ContactSheet. */
export function CoinBand() {
  const t = useT(home);
  const c = useT(common);
  const l = useL10n();
  const [ask, setAsk] = useState(false);
  return (
    <section aria-labelledby="coin-title" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid overflow-hidden rounded-[6px] border border-line md:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col justify-center px-5 py-7 sm:px-8 lg:px-10">
          <h2 id="coin-title" className="text-[22px] font-semibold leading-tight text-ink sm:text-[28px]">{t("coinTitle")}</h2>
          <p className="mt-2 text-[14.5px] text-mute">{t("coinSub", { pct: OFFER.gstPct })}</p>
          <p className="mt-1 text-[14.5px] text-mute">{c("contactIntroCoins")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="maroon" onClick={() => setAsk(true)} aria-haspopup="dialog">{t("coinCta")}</Button>
            <Button variant="ghost" href={routes.shop("coin")}>{t("coinShop")}</Button>
          </div>
        </div>
        <ul className="grid grid-cols-2 border-t border-line bg-cream md:border-l md:border-t-0">
          {COINS.map((p, i) => (
            <li key={p.slug} className={i ? "border-l border-line" : ""}>
              <Link href={routes.product(p.slug)} className="group block p-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold sm:p-6">
                <ProductImage src={p.image} alt={l(p.name)} kind="coin" zoom className="aspect-square w-full rounded-[4px]" />
                <p className="mt-3 text-[14.5px] font-medium text-ink group-hover:text-maroon">{t("coinRow", { g: p.weightG })}</p>
                <Price value={priceBreakdown(p, "buy").total} size="md" className="text-maroon" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ContactSheet open={ask} onClose={() => setAsk(false)} topic="goldCoins" />
    </section>
  );
}
