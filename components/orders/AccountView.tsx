"use client";
import Link from "next/link";
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
import { GoldRule } from "@/components/brand/GoldRule";
import { useHydrated } from "./useHydrated";

const link = "text-maroon underline decoration-gold decoration-1 underline-offset-4 hover:text-maroon-deep focus-visible:outline-2 focus-visible:outline-gold";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-gold/50 py-8">
      <h2 id={id} className="font-display text-2xl font-semibold text-maroon-deep">{title}</h2>
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
  const shell = "mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14";

  if (!hydrated) return <div className={shell}><p className="text-ink/60" role="status">{k("loading")}</p></div>;

  if (!user) {
    return (
      <div className={shell}>
        <h1 className="font-display text-3xl font-semibold text-maroon sm:text-5xl">{t("signedOutTitle")}</h1>
        <GoldRule className="mt-5 max-w-md" />
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink/80">{t("signedOutBody")}</p>
        <Button variant="maroon" size="lg" onClick={() => dispatch({ type: "signInDemo" })} className="mt-7">{t("useDemo")}</Button>
      </div>
    );
  }

  const orders = [...state.orders].reverse();
  const digi = digiBalance(state.digi);

  return (
    <div className={shell}>
      <h1 className="font-display text-3xl font-semibold text-maroon sm:text-5xl">{t("title")}</h1>
      <GoldRule className="mt-5 max-w-md" />

      <div className="mt-8 border border-gold/60 bg-maroon px-6 py-6 text-ivory sm:px-8">
        <h2 className="font-display text-xl text-gold-light">{t("profile")}</h2>
        <dl className="mt-3 grid gap-x-10 gap-y-2 sm:grid-cols-2">
          <div><dt className="text-[13px] text-ivory/70">{t("name")}</dt><dd className="font-display text-2xl font-semibold">{user.name}</dd></div>
          <div><dt className="text-[13px] text-ivory/70">{t("phone")}</dt><dd className="num font-display text-2xl font-semibold">{user.phone}</dd></div>
        </dl>
      </div>

      <div className="mt-4">
        <Section id="orders-h" title={t("orders")}>
          {orders.length === 0 ? (
            <div>
              <p className="text-ink/75">{t("ordersEmpty")}</p>
              <Button href={routes.shop()} variant="ghost" className="mt-4">{t("ordersShop")}</Button>
            </div>
          ) : (
            <ul className="divide-y divide-gold/40 border-y border-gold/40">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link href={routes.order(o.id)} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-gold sm:px-3">
                    <span>
                      <span className="num font-display text-xl font-semibold text-maroon-deep">{o.id}</span>
                      <span className="mt-0.5 block text-[14px] text-ink/70">
                        {formatDate(o.createdAt, lang)}, {o.kind === "custom" ? t("orderCustom") : t("orderPieces", { n: o.lines.reduce((n, x) => n + x.qty, 0) })}
                      </span>
                    </span>
                    <span className="flex items-baseline gap-5">
                      <span className="text-[14px] font-medium text-emerald">{k(`track${o.status[0].toUpperCase()}${o.status.slice(1)}` as "trackBooked")}</span>
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
              <p className="text-ink/75">{t("planEmpty")}</p>
              <Button href={routes.scheme()} variant="ghost" className="mt-4">{t("planJoin")}</Button>
            </div>
          ) : (
            <ul className="space-y-5">
              {state.plans.map((p) => {
                const s = planSummary(p);
                return (
                  <li key={p.id} className="border border-gold/50 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-display text-xl font-semibold text-maroon-deep">{t("planName", { monthly: formatINR(p.monthly) })}</p>
                      <p className="text-[14px] text-ink/70">{t("planMaturity", { amount: formatINR(s.maturityValue) })}</p>
                    </div>
                    <p className="mt-2 text-[15px] text-ink/80">{t("planProgress", { paid: s.paidCount, months: SCHEME.months })}</p>
                    <div className="mt-2 h-1.5 bg-maroon/15" role="presentation"><div className="h-full bg-gold" style={{ width: `${Math.min(100, (s.paidCount / SCHEME.months) * 100)}%` }} /></div>
                    <p className="mt-2 text-[14px] text-ink/70">{s.nextDueDate ? t("planNext", { date: formatDate(s.nextDueDate, lang) }) : t("planDone")}</p>
                    <Link href={routes.scheme()} className={`mt-3 inline-block text-[15px] ${link}`}>{t("planOpen")}</Link>
                  </li>
                );
              })}
            </ul>
          )}
          {state.digi.txns.length > 0 && (
            <p className="mt-5 flex flex-wrap items-baseline gap-x-3 text-[15px] text-ink/80">
              {t("digi")}
              <span className="num font-display text-2xl font-semibold text-maroon">{t("digiGrams", { g: digi.toFixed(4) })}</span>
              <Link href={routes.scheme()} className={`text-[15px] ${link}`}>{t("planOpen")}</Link>
            </p>
          )}
        </Section>

        <Section id="appts-h" title={t("appts")}>
          {state.appointments.length === 0 ? (
            <p className="text-ink/75">{t("apptsEmpty")}</p>
          ) : (
            <ul className="divide-y divide-gold/40 border-y border-gold/40">
              {state.appointments.map((a) => (
                <li key={a.id} className="py-4">
                  <p className="font-display text-xl font-semibold text-maroon-deep">{t(a.kind === "sell" ? "apptSell" : "apptRelease")}</p>
                  <p className="text-[14px] text-ink/70">
                    {formatDate(a.date, lang)}{a.grams ? `, ${t("apptGrams", { g: a.grams })}` : ""}{a.purity ? `, ${a.purity}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <section className="border-t border-gold/50 pt-8">
          <div className="flex flex-wrap gap-3">
            <Button variant="maroon" onClick={() => dispatch({ type: "signOut" })}>{t("signOut")}</Button>
            <Button variant="ghost" onClick={() => dispatch({ type: "reset" })}>{t("reset")}</Button>
          </div>
          <p className="mt-3 max-w-xl text-[14px] text-ink/65">{t("resetNote")}</p>
        </section>
      </div>
    </div>
  );
}
