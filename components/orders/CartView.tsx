"use client";
import { getProduct } from "@/lib/catalog";
import { priceBreakdown } from "@/lib/pricing";
import { cartTotals } from "@/lib/demo-state";
import { OFFER } from "@/lib/site.config";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { useL10n, useT } from "@/lib/i18n";
import { checkout } from "@/lib/i18n/dict/checkout";
import { common } from "@/lib/i18n/dict/common";
import { formatINR } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { ProductImage } from "@/components/ui/ProductImage";
import { GoldRule } from "@/components/brand/GoldRule";
import { useHydrated } from "./useHydrated";
import { Totals } from "./Totals";

export function CartView() {
  const t = useT(checkout);
  const c = useT(common);
  const l = useL10n();
  const hydrated = useHydrated();
  const { state, dispatch } = useDemo();
  const lines = state.cart.filter((x) => getProduct(x.slug));
  const totals = cartTotals(lines);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-display text-3xl font-semibold text-maroon sm:text-5xl">{t("cartTitle")}</h1>
      <GoldRule className="mt-5 max-w-md" />

      {!hydrated ? (
        <p className="mt-10 text-ink/60" role="status">{t("loading")}</p>
      ) : lines.length === 0 ? (
        <div className="mt-10 max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-maroon-deep">{t("cartEmptyTitle")}</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-ink/80">{t("cartEmptyBody", { off: OFFER.prebookOffPerGram, pct: OFFER.prebookAdvancePct })}</p>
          <Button href={routes.shop()} variant="maroon" size="lg" className="mt-7">{t("cartEmptyCta")}</Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
          <ul className="divide-y divide-gold/40 border-y border-gold/40">
            {lines.map((line) => {
              const p = getProduct(line.slug)!;
              const b = priceBreakdown(p, line.mode);
              const name = l(p.name);
              const prebook = line.mode === "prebook";
              const purity = p.purity === "22K" ? c("purity916") : p.purity === "silver" ? c("rateSilver") : p.purity;
              return (
                <li key={line.id} className="grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-3 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-x-6">
                  <ProductImage src={p.image} alt={name} kind={p.category} className="aspect-[4/5] w-full" />
                  <div className="min-w-0">
                    <span
                      className={`inline-block border px-2 py-0.5 text-[13px] font-medium ${
                        prebook ? "border-emerald/60 bg-emerald/10 text-emerald" : "border-maroon/40 text-maroon"
                      }`}
                    >
                      {prebook ? t("modePrebook") : t("modeBuy")}
                    </span>
                    <h2 className="mt-1.5 font-display text-[1.35rem] font-semibold leading-snug text-maroon-deep">{name}</h2>
                    <p className="mt-0.5 text-[14px] text-ink/65">
                      {purity}, {c("weightG", { g: p.weightG })}{line.size ? `, ${t("sizeLabel", { size: line.size })}` : ""}
                    </p>
                    {prebook && <p className="mt-1 text-[14px] text-emerald">{t("lineAdvance", { amount: formatINR(b.advance * line.qty) })}</p>}
                  </div>
                  <div className="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:flex-col sm:items-end sm:justify-between">
                    <Price value={b.total * line.qty} size="md" className="text-maroon" />
                    <div className="flex items-center gap-4">
                      <div role="group" aria-label={t("qty")} className="flex items-center border border-maroon/30">
                        <button
                          type="button"
                          aria-label={t("qtyDec", { name })}
                          disabled={line.qty <= 1}
                          onClick={() => dispatch({ type: "setQty", id: line.id, qty: line.qty - 1 })}
                          className="grid size-10 place-items-center text-lg text-maroon hover:bg-gold/15 focus-visible:outline-2 focus-visible:outline-gold disabled:opacity-35"
                        >
                          −
                        </button>
                        <span className="num min-w-8 text-center font-display text-lg font-semibold text-maroon-deep" aria-live="polite">{line.qty}</span>
                        <button
                          type="button"
                          aria-label={t("qtyInc", { name })}
                          onClick={() => dispatch({ type: "setQty", id: line.id, qty: line.qty + 1 })}
                          className="grid size-10 place-items-center text-lg text-maroon hover:bg-gold/15 focus-visible:outline-2 focus-visible:outline-gold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={t("removeLabel", { name })}
                        onClick={() => dispatch({ type: "removeLine", id: line.id })}
                        className="min-h-10 text-[14px] text-maroon underline decoration-gold decoration-1 underline-offset-4 hover:text-maroon-deep focus-visible:outline-2 focus-visible:outline-gold"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Totals {...totals}>
              <Button href={routes.checkout()} variant="gold" size="lg" full>{t("toCheckout")}</Button>
              <Button href={routes.shop()} variant="ghost" full className="!text-gold-light hover:!bg-gold/15">{t("keepShopping")}</Button>
            </Totals>
          </div>
        </div>
      )}
    </div>
  );
}
