"use client";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, getProduct } from "@/lib/catalog";
import { priceBreakdown } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { formatDate, useL10n, useLang, useT } from "@/lib/i18n";
import { checkout } from "@/lib/i18n/dict/checkout";
import { common } from "@/lib/i18n/dict/common";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { GoldRule } from "@/components/brand/GoldRule";
import { OrderTracker } from "./OrderTracker";
import { useHydrated } from "./useHydrated";

const shell = "mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14";

export function OrderView() {
  const t = useT(checkout);
  const c = useT(common);
  const l = useL10n();
  const [lang] = useLang();
  const hydrated = useHydrated();
  const id = useSearchParams().get("id") ?? "";
  const { state, lastOrderId } = useDemo();
  const order = state.orders.find((o) => o.id === id);

  if (!hydrated) return <div className={shell}><p className="text-ink/60" role="status">{t("loading")}</p></div>;

  if (!order) {
    return (
      <div className={shell}>
        <h1 className="font-display text-3xl font-semibold text-maroon sm:text-5xl">{t("orderNotFound")}</h1>
        <GoldRule className="mt-5 max-w-md" />
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink/80">{t("orderNotFoundBody")}</p>
        <Button href={routes.shop()} variant="maroon" size="lg" className="mt-7">{t("orderToShop")}</Button>
      </div>
    );
  }

  const fresh = lastOrderId === order.id;
  const methodLabel = c(order.payMethod === "upi" ? "payUpi" : order.payMethod === "card" ? "payCard" : "payNet");
  const balance = order.total - order.advancePaid;
  const custom = order.custom;
  const catName = custom ? l(CATEGORIES.find((x) => x.id === custom.type)!) : "";

  return (
    <div className={shell}>
      <div className="border border-gold/60 bg-maroon px-6 py-7 text-ivory sm:px-9">
        {fresh && <p className="font-display text-xl text-gold-light">{t("orderThanks")}</p>}
        <h1 className="font-display text-3xl font-semibold text-ivory sm:text-5xl">{t("orderTitle", { id: order.id })}</h1>
        <p className="mt-2 text-[15px] text-ivory/80">
          {fresh ? `${t("orderThanksBody")} ` : ""}{t("orderPlaced", { date: formatDate(order.createdAt, lang) })}
        </p>
        <p className="mt-4 text-[15px] text-gold-light">{t("orderDemo")}</p>
      </div>

      <section className="mt-10" aria-labelledby="track-h">
        <h2 id="track-h" className="font-display text-2xl font-semibold text-maroon-deep">{t("orderTrack")}</h2>
        <OrderTracker status={order.status} className="mt-6" />
      </section>

      <div className="mt-12 grid gap-10 border-t border-gold/50 pt-10 md:grid-cols-[1fr_20rem]">
        <section aria-labelledby="items-h">
          <h2 id="items-h" className="font-display text-2xl font-semibold text-maroon-deep">{t("orderItems")}</h2>
          <ul className="mt-4 divide-y divide-gold/40 border-y border-gold/40">
            {custom && (
              <li className="py-4">
                <p className="font-display text-xl font-semibold text-maroon-deep">{t("orderCustom")}</p>
                <p className="text-[14px] text-ink/70">{t("orderCustomDetail", { type: catName, purity: custom.purity, g: custom.approxWeightG })}</p>
                {custom.notes && <p className="mt-1 text-[14px] text-ink/70">{custom.notes}</p>}
              </li>
            )}
            {order.lines.map((line) => {
              const p = getProduct(line.slug);
              if (!p) return null;
              const b = priceBreakdown(p, line.mode);
              return (
                <li key={line.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="font-display text-xl font-semibold text-maroon-deep">{l(p.name)}{line.qty > 1 ? ` × ${line.qty}` : ""}</p>
                    <p className="text-[14px] text-ink/70">
                      {line.mode === "prebook" ? t("modePrebook") : t("modeBuy")}, {c("weightG", { g: p.weightG })}
                      {line.size ? `, ${t("sizeLabel", { size: line.size })}` : ""}
                    </p>
                  </div>
                  <Price value={b.total * line.qty} size="md" className="shrink-0 text-maroon" />
                </li>
              );
            })}
          </ul>
        </section>

        <aside>
          <dl className="space-y-3 text-[15px]">
            <div className="flex items-baseline justify-between gap-4"><dt className="text-ink/75">{t("orderTotal")}</dt><dd><Price value={order.total} size="md" className="text-maroon" /></dd></div>
            <div className="flex items-baseline justify-between gap-4"><dt className="text-ink/75">{t("orderPaid")}</dt><dd><Price value={order.advancePaid} size="md" className="text-emerald" /></dd></div>
            <div className="flex items-baseline justify-between gap-4 border-t border-gold/50 pt-3"><dt className="font-medium text-maroon-deep">{t("orderBalance")}</dt><dd><Price value={balance} size="md" className="text-maroon" /></dd></div>
          </dl>
          <p className="mt-5 text-[14px] text-ink/70">{t("orderPaidBy", { method: methodLabel })}</p>
          <p className="mt-1 text-[14px] text-ink/70">{t("orderCollect")}: {t(order.fulfilment === "pickup" ? "orderPickup" : "orderDelivery")}</p>
          <Button href={routes.account()} variant="ghost" className="mt-6">{t("orderBackToAccount")}</Button>
        </aside>
      </div>
    </div>
  );
}
