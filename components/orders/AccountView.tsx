"use client";
import Link from "next/link";
import { useState } from "react";
import { formatINR } from "@/lib/pricing";
import { digiBalance, planSummary } from "@/lib/scheme";
import { SCHEME } from "@/lib/site.config";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { account } from "@/lib/i18n/dict/account";
import { checkout } from "@/lib/i18n/dict/checkout";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { useHydrated } from "./useHydrated";

const link = "text-maroon underline underline-offset-4 hover:text-maroon-deep focus-visible:outline-2 focus-visible:outline-gold";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-[6px] border border-line bg-white p-5 sm:p-6">
      <h2 id={id} className="text-[20px] font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AccountView() {
  const t = useT(account);
  const k = useT(checkout);
  const [lang] = useLang();
  const hydrated = useHydrated();
  const { state, dispatch } = useDemo();
  const { user } = state;
  const [confirmReset, setConfirmReset] = useState(false);
  const shell = "mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8";

  if (!hydrated) return <div className={shell}><p className="text-mute" role="status">{k("loading")}</p></div>;

  if (!user) {
    return (
      <div className={shell}>
        <h1 className="text-[28px] font-semibold leading-tight text-ink sm:text-[36px]">{t("signedOutTitle")}</h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-mute">{t("signedOutBody")}</p>
        <Button variant="maroon" size="lg" onClick={() => dispatch({ type: "signInDemo" })} className="mt-7">{t("useDemo")}</Button>
      </div>
    );
  }

  const orders = [...state.orders].reverse();
  const digi = digiBalance(state.digi);

  return (
    <div className={shell}>
      <h1 className="text-[28px] font-semibold leading-tight text-ink sm:text-[36px]">{t("title")}</h1>

      <div className="mt-6 rounded-[6px] border border-line bg-white p-5 sm:p-6">
        <h2 className="text-[20px] font-semibold text-ink">{t("profile")}</h2>
        <dl className="mt-3 grid gap-x-10 gap-y-2 sm:grid-cols-2">
          <div><dt className="text-[13px] text-mute">{t("name")}</dt><dd className="text-[18px] font-semibold text-ink">{user.name}</dd></div>
          <div><dt className="text-[13px] text-mute">{t("phone")}</dt><dd className="text-[18px] font-semibold text-ink">{user.phone}</dd></div>
        </dl>
      </div>

      <div className="mt-5 space-y-5">
        <Section id="orders-h" title={t("orders")}>
          {orders.length === 0 ? (
            <div>
              <p className="text-mute">{t("ordersEmpty")}</p>
              <Button href={routes.shop()} variant="ghost" className="mt-4">{t("ordersShop")}</Button>
            </div>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link href={routes.order(o.id)} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 hover:bg-cream focus-visible:outline-2 focus-visible:outline-gold sm:px-3">
                    <span>
                      <span className="text-[16px] font-semibold text-ink">{o.id}</span>
                      <span className="mt-0.5 block text-[14px] text-mute">
                        {formatDate(o.createdAt, lang)}, {o.kind === "custom" ? t("orderCustom") : t("orderPieces", { n: o.lines.reduce((n, x) => n + x.qty, 0) })}
                      </span>
                    </span>
                    <span className="flex items-baseline gap-5">
                      <span className="text-[13.5px] font-medium text-ink">{k(`track${o.status[0].toUpperCase()}${o.status.slice(1)}` as "trackBooked")}</span>
                      <Price value={o.total} size="md" className="text-maroon" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section id="plans-h" title={t("passbook")}>
          {state.plans.length === 0 ? (
            <div>
              <p className="text-mute">{t("planEmpty")}</p>
              <Button href={routes.scheme()} variant="ghost" className="mt-4">{t("planJoin")}</Button>
            </div>
          ) : (
            <ul className="space-y-5">
              {state.plans.map((p) => {
                const s = planSummary(p);
                return (
                  <li key={p.id} className="rounded-[4px] border border-line p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-[16px] font-semibold text-ink">{t("planName", { monthly: formatINR(p.monthly) })}</p>
                      <p className="text-[14px] text-mute">{t("planMaturity", { amount: formatINR(s.maturityValue) })}</p>
                    </div>
                    <p className="mt-2 text-[15px] text-mute">{t("planProgress", { paid: s.paidCount, months: SCHEME.months })}</p>
                    <div className="mt-2 h-1.5 bg-line" role="presentation"><div className="h-full bg-maroon" style={{ width: `${Math.min(100, (s.paidCount / SCHEME.months) * 100)}%` }} /></div>
                    <p className="mt-2 text-[14px] text-mute">{s.nextDueDate ? t("planNext", { date: formatDate(s.nextDueDate, lang) }) : t("planDone")}</p>
                    <Link href={routes.scheme()} className={`mt-3 inline-block text-[15px] ${link}`}>{t("planOpen")}</Link>
                  </li>
                );
              })}
            </ul>
          )}
          {state.digi.txns.length > 0 && (
            <p className="mt-5 flex flex-wrap items-baseline gap-x-3 text-[15px] text-mute">
              {t("digi")}
              <span className="text-[22px] font-semibold text-maroon">{t("digiGrams", { g: digi.toFixed(4) })}</span>
              <Link href={routes.scheme()} className={`text-[15px] ${link}`}>{t("planOpen")}</Link>
            </p>
          )}
        </Section>

        <Section id="appts-h" title={t("appts")}>
          {state.appointments.length === 0 ? (
            <p className="text-mute">{t("apptsEmpty")}</p>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {state.appointments.map((a) => (
                <li key={a.id} className="py-4">
                  <p className="text-[16px] font-semibold text-ink">{t(a.kind === "sell" ? "apptSell" : "apptRelease")}</p>
                  <p className="text-[14px] text-mute">
                    {formatDate(a.date, lang)}{a.grams ? `, ${t("apptGrams", { g: a.grams })}` : ""}{a.purity ? `, ${a.purity}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <section className="pt-2">
          <div className="flex flex-wrap gap-3">
            <Button variant="maroon" onClick={() => dispatch({ type: "signOut" })}>{t("signOut")}</Button>
            {!confirmReset && <Button variant="ghost" onClick={() => setConfirmReset(true)}>{t("reset")}</Button>}
          </div>
          {confirmReset && (
            <div role="alertdialog" aria-label={t("resetConfirm")} className="mt-4 max-w-xl rounded-[4px] border border-line p-4">
              <p className="text-[15px] text-ink">{t("resetConfirm")}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button variant="maroon" onClick={() => { dispatch({ type: "reset" }); setConfirmReset(false); }}>{t("resetYes")}</Button>
                <Button variant="ghost" onClick={() => setConfirmReset(false)}>{t("resetNo")}</Button>
              </div>
            </div>
          )}
          <p className="mt-3 max-w-xl text-[14px] text-mute">{t("resetNote")}</p>
        </section>
      </div>
    </div>
  );
}
