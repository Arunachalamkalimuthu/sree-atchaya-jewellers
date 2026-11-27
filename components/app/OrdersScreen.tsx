"use client";
import Link from "next/link";
import { CATEGORIES, getProduct, type CategoryId } from "@/lib/catalog";
import type { Order } from "@/lib/demo-state";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { formatDate, useL10n, useLang, useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { checkout } from "@/lib/i18n/dict/checkout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductImage } from "@/components/ui/ProductImage";
import { useHydrated } from "@/components/orders/useHydrated";
import { nicheTone } from "@/components/shop/query";
import { AppHeader } from "./AppHeader";
import { statusKey } from "./order-labels";
import { useAppLocal } from "./app-store";

/** The order's title and the kind of piece for its thumbnail. */
export function useOrderTitle() {
  const t = useT(app);
  const l = useL10n();
  return (o: Order): { title: string; kind: CategoryId } => {
    if (o.kind === "custom" && o.custom) {
      const cat = CATEGORIES.find((c) => c.id === o.custom!.type)!;
      const name = l(cat);
      return { title: t("orderCustom", { type: name.toLowerCase() }), kind: o.custom.type };
    }
    const first = getProduct(o.lines[0]?.slug ?? "");
    const name = first ? l(first.name) : o.id;
    const more = o.lines.length - 1;
    return { title: more > 0 ? t("orderMore", { name, n: more }) : name, kind: first?.category ?? "necklace" };
  };
}

/** Status shown for an order: a design approved in the app (locally) moves a booked order on one step. */
export function useShownStatus() {
  const [local] = useAppLocal();
  return (o: Order) => (o.status === "booked" && local.approved.includes(o.id) ? "design_approved" : o.status);
}

export function OrdersScreen() {
  const t = useT(app);
  const k = useT(checkout);
  const [lang] = useLang();
  const hydrated = useHydrated();
  const { state, dispatch } = useDemo();
  const titleOf = useOrderTitle();
  const statusOf = useShownStatus();
  const orders = [...state.orders].reverse();

  return (
    <>
      <AppHeader title={t("ordersTitle")} />
      <main className="mx-auto w-full max-w-xl px-4 pb-8 pt-4">
        {!hydrated ? (
          <p role="status" className="text-ink/60">{t("loading")}</p>
        ) : orders.length === 0 ? (
          <div className="pt-6">
            <h2 className="font-display text-[1.6rem] font-semibold text-maroon">{t("ordersEmpty")}</h2>
            <p className="mt-2 text-[15px] leading-snug text-ink/75">{t("ordersEmptyBody")}</p>
            <div className="mt-5 space-y-3">
              <Button variant="maroon" full href={routes.app.shop()}>{t("ordersShop")}</Button>
              {!state.user && <Button variant="ghost" full onClick={() => dispatch({ type: "signInDemo" })}>{t("demoCta")}</Button>}
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gold/35 border-y border-gold/35">
            {orders.map((o) => {
              const { title, kind } = titleOf(o);
              const status = statusOf(o);
              return (
                <li key={o.id}>
                  <Link href={routes.app.order(o.id)} className="flex items-center gap-3.5 py-3.5 focus-visible:outline-2 focus-visible:outline-gold" data-testid="order-row">
                    <ProductImage src="" alt="" kind={kind} tone={nicheTone(kind)} available={false} className="size-[68px] shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[1.15rem] font-semibold leading-tight text-maroon-deep">{title}</span>
                      <span className="mt-0.5 block text-[12.5px] text-ink/55">{o.id}, {t("orderBooked", { date: formatDate(o.createdAt, lang) })}</span>
                      <span className="mt-1 flex items-baseline justify-between gap-2">
                        <span className={`text-[13px] font-medium ${status === "ready" ? "text-maroon" : "text-emerald"}`}>{k(statusKey(status))}</span>
                        <span className="num font-display text-[1.05rem] font-semibold text-maroon">{formatINR(o.total)}</span>
                      </span>
                    </span>
                    <Icon name="chevron-right" size={18} className="shrink-0 text-maroon/45" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
