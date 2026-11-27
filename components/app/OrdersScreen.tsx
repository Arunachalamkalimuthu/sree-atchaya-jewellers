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
import { useHydrated } from "@/components/orders/useHydrated";
import { AppHeader } from "./AppHeader";
import { AppPhoto } from "./AppPhoto";
import { statusKey } from "./order-labels";
import { useAppLocal } from "./app-store";

/** The order's title, and the kind of piece and photo for its thumbnail (custom orders have no photo yet). */
export function useOrderTitle() {
  const t = useT(app);
  const l = useL10n();
  return (o: Order): { title: string; kind: CategoryId; image: string } => {
    if (o.kind === "custom" && o.custom) {
      const cat = CATEGORIES.find((c) => c.id === o.custom!.type)!;
      const name = l(cat);
      return { title: t("orderCustom", { type: name.toLowerCase() }), kind: o.custom.type, image: "" };
    }
    const first = getProduct(o.lines[0]?.slug ?? "");
    const name = first ? l(first.name) : o.id;
    const more = o.lines.length - 1;
    return { title: more > 0 ? t("orderMore", { name, n: more }) : name, kind: first?.category ?? "necklace", image: first?.image ?? "" };
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
          <p role="status" className="text-[#6B5E57]">{t("loading")}</p>
        ) : orders.length === 0 ? (
          <div className="pt-6">
            <h2 className="text-[20px] font-semibold text-ink">{t("ordersEmpty")}</h2>
            <p className="mt-1.5 text-[15px] leading-snug text-[#6B5E57]">{t("ordersEmptyBody")}</p>
            <div className="mt-5 space-y-3">
              <Button variant="maroon" full href={routes.app.shop()}>{t("ordersShop")}</Button>
              {!state.user && <Button variant="ghost" full onClick={() => dispatch({ type: "signInDemo" })}>{t("demoCta")}</Button>}
            </div>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {orders.map((o) => {
              const { title, kind, image } = titleOf(o);
              const status = statusOf(o);
              return (
                <li key={o.id}>
                  <Link href={routes.app.order(o.id)} className="flex items-center gap-3 rounded-[12px] border border-[#ECE6DF] bg-white p-2.5 pr-3 focus-visible:outline-2 focus-visible:outline-maroon" data-testid="order-row">
                    <AppPhoto src={image} alt="" kind={kind} className="size-[64px] shrink-0 rounded-[8px]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold leading-tight text-ink">{title}</span>
                      <span className="mt-0.5 block text-[12.5px] text-[#6B5E57]">{o.id}, {t("orderBooked", { date: formatDate(o.createdAt, lang) })}</span>
                      <span className="mt-1 flex items-baseline justify-between gap-2">
                        <span className={`text-[13px] font-medium ${status === "ready" ? "text-maroon" : "text-emerald"}`}>{k(statusKey(status))}</span>
                        <span className="num text-[15px] font-semibold text-ink">{formatINR(o.total)}</span>
                      </span>
                    </span>
                    <Icon name="chevron-right" size={18} className="shrink-0 text-[#A39890]" />
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
