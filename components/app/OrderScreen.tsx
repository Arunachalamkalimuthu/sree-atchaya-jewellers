"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { formatDate, useL10n, useLang, useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { common } from "@/lib/i18n/dict/common";
import { Button } from "@/components/ui/Button";
import { ContactSheet } from "@/components/ui/ContactSheet";
import { OrderTracker } from "@/components/orders/OrderTracker";
import { useHydrated } from "@/components/orders/useHydrated";
import { AppHeader } from "./AppHeader";
import { ApproveDesign } from "./ApproveDesign";
import { useOrderTitle, useShownStatus } from "./OrdersScreen";

/** `/app/orders/view/?id=`: one order with the vertical tracker, the design-approval card for custom orders, money. */
export function OrderScreen() {
  const t = useT(app);
  const tc = useT(common);
  const l = useL10n();
  const [lang] = useLang();
  const hydrated = useHydrated();
  const id = useSearchParams().get("id") ?? "";
  const { state } = useDemo();
  const titleOf = useOrderTitle();
  const statusOf = useShownStatus();
  const [contact, setContact] = useState(false);
  const order = state.orders.find((o) => o.id === id);

  if (!hydrated) {
    return (
      <>
        <AppHeader title={t("ordersTitle")} back={routes.app.orders()} />
        <main className="px-4 pt-6"><p role="status" className="text-ink/60">{t("loading")}</p></main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <AppHeader title={t("ordersTitle")} back={routes.app.orders()} />
        <main className="mx-auto w-full max-w-xl px-4 pt-8">
          <h2 className="font-display text-[1.7rem] font-semibold text-maroon">{t("orderNotFound")}</h2>
          <p className="mt-2 text-[15px] leading-snug text-ink/75">{t("orderNotFoundBody")}</p>
          <Button variant="maroon" full className="mt-5" href={routes.app.orders()}>{t("ordersTitle")}</Button>
        </main>
      </>
    );
  }

  const { title } = titleOf(order);
  const status = statusOf(order);
  const custom = order.kind === "custom" && order.custom;
  const showApprove = custom && (order.status === "booked" || order.status === "design_approved");
  const balance = order.total - order.advancePaid;
  const purity = custom ? (order.custom!.purity === "22K" ? tc("purity916") : order.custom!.purity) : "";

  return (
    <>
      <AppHeader title={order.id} back={routes.app.orders()} />
      <main className="mx-auto w-full max-w-xl px-4 pb-8 pt-5">
        <h2 className="font-display text-[1.75rem] font-semibold leading-tight text-maroon-deep" data-testid="order-title">{title}</h2>
        <p className="mt-1 text-[13.5px] text-ink/60 num">
          {t("orderBooked", { date: formatDate(order.createdAt, lang) })}
          {custom ? `. ${t("orderSpec", { purity, g: order.custom!.approxWeightG })}` : ""}
        </p>

        {showApprove && <div className="mt-5"><ApproveDesign order={order} /></div>}

        <section aria-labelledby="progress-title" className="mt-7">
          <h3 id="progress-title" className="font-display text-[1.3rem] font-semibold text-maroon">{t("orderProgress")}</h3>
          <OrderTracker status={status} vertical className="mt-4" />
        </section>

        {!custom && order.lines.length > 0 && (
          <ul className="mt-7 divide-y divide-gold/30 border-y border-gold/30 text-[14.5px]">
            {order.lines.map((ln) => {
              const p = getProduct(ln.slug);
              return (
                <li key={ln.id} className="flex justify-between gap-3 py-2.5">
                  <span className="min-w-0">{p ? l(p.name) : ln.slug}{ln.size ? `, ${ln.size}` : ""}</span>
                  <span className="shrink-0 text-ink/60 num">×{ln.qty}</span>
                </li>
              );
            })}
          </ul>
        )}

        <dl className="mt-7 border-t border-gold/45 text-[15px]">
          <Row label={t("orderTotal")} value={formatINR(order.total)} strong />
          <Row label={t("orderAdvance")} value={formatINR(order.advancePaid)} />
          <Row label={t("orderBalance")} value={balance > 0 ? formatINR(balance) : t("orderPaidFull")} />
          <Row label={order.fulfilment === "pickup" ? t("orderPickup") : t("orderDelivery")} value={order.fulfilment === "pickup" ? tc("footerHours") : ""} small />
        </dl>

        <Button variant="ghost" full className="mt-6" onClick={() => setContact(true)} aria-haspopup="dialog">{t("orderTalk")}</Button>
      </main>
      <ContactSheet open={contact} onClose={() => setContact(false)} />
    </>
  );
}

function Row({ label, value, strong, small }: { label: string; value: string; strong?: boolean; small?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-gold/25 py-2.5">
      <dt className="text-ink/70">{label}</dt>
      <dd className={`num text-right ${small ? "text-[13px] text-ink/60" : strong ? "font-display text-[1.35rem] font-semibold text-maroon" : "font-display text-[1.15rem] font-semibold text-maroon-deep"}`}>{value}</dd>
    </div>
  );
}
