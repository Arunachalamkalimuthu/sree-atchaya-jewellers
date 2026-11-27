"use client";
import Link from "next/link";
import { OFFER, PURCHASE_RATES, RATES, SCHEME, SITE } from "@/lib/site.config";
import { demoSeed, ORDER_STEPS } from "@/lib/demo-state";
import { digiBalance, planSummary } from "@/lib/scheme";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { checkout } from "@/lib/i18n/dict/checkout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { AppHeader } from "./AppHeader";
import { RateCard } from "./RateCard";
import { ProgressRing } from "./ProgressRing";
import { OffersCarousel } from "./OffersCarousel";
import { AppIcon, type AppIconName } from "./AppIcons";
import { SiteButton, SiteLink } from "./frame";
import { statusKey } from "./order-labels";
import { useOrderTitle, useShownStatus } from "./OrdersScreen";

export function HomeScreen() {
  const t = useT(app);
  const [lang] = useLang();
  const { state } = useDemo();
  const first = state.user?.name.split(" ")[0];

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-xl pb-8">
        <div className="px-4 pt-5">
          <p className="font-display text-[1.9rem] font-semibold leading-tight text-maroon-deep">
            {first ? t("greet", { name: first }) : t("greetAnon")}
          </p>
          <p className="text-[13.5px] text-ink/60">{t("today", { date: formatDate(SITE.ratesDate, lang) })}</p>
          <RateCard className="mt-4" />
        </div>
        <SchemeCard />
        <QuickActions />
        <OffersCarousel />
        <LatestOrder />
      </main>
    </>
  );
}

function SchemeCard() {
  const t = useT(app);
  const [lang] = useLang();
  const { state, dispatch } = useDemo();

  if (!state.user) {
    const seedPlan = planSummary(demoSeed.plans[0]);
    return (
      <section className="mx-4 mt-6 border border-maroon/20 bg-white/60 px-5 py-5">
        <h2 className="font-display text-[1.35rem] font-semibold text-maroon">{t("demoTitle")}</h2>
        <p className="mt-1.5 text-[14.5px] leading-snug text-ink/75 num">
          {t("demoBody", { paid: seedPlan.paidCount, months: SCHEME.months, g: digiBalance(demoSeed.digi) })}
        </p>
        <Button variant="maroon" full className="mt-4" onClick={() => dispatch({ type: "signInDemo" })}>{t("demoCta")}</Button>
      </section>
    );
  }

  const plan = state.plans.find((p) => !planSummary(p).complete) ?? state.plans.at(-1);
  if (!plan) {
    return (
      <section className="mx-4 mt-6 border border-maroon/20 bg-white/60 px-5 py-5">
        <h2 className="font-display text-[1.35rem] font-semibold text-maroon">{t("ringNoPlanTitle")}</h2>
        <p className="mt-1.5 text-[14.5px] leading-snug text-ink/75">{t("ringNoPlan", { months: SCHEME.months })}</p>
        <SiteButton href={routes.schemeJoin("monthly")} className="mt-4">{t("ringJoin")}</SiteButton>
      </section>
    );
  }

  const s = planSummary(plan);
  return (
    <section aria-labelledby="ring-title" className="mx-4 mt-6 border border-maroon/20 bg-white/60">
      <Link href={routes.app.scheme()} className="flex items-center gap-4 px-4 py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold">
        <ProgressRing value={s.paidCount} total={SCHEME.months} label={t("ringLabel", { n: s.paidCount, total: SCHEME.months })} />
        <div className="min-w-0 flex-1">
          <h2 id="ring-title" className="font-display text-[1.3rem] font-semibold leading-tight text-maroon">{t("ringTitle")}</h2>
          <p className="mt-0.5 text-[14px] text-ink/70 num">{t("ringPlan", { amount: formatINR(plan.monthly) })}</p>
          <p className="mt-1.5 text-[14px] leading-snug text-maroon-deep num" data-testid="home-next">
            {s.complete ? t("ringDone", { months: SCHEME.months }) : t("ringNext", { n: s.paidCount + 1, date: formatDate(s.nextDueDate!, lang) })}
          </p>
        </div>
        <Icon name="chevron-right" size={18} className="shrink-0 text-maroon/50" />
      </Link>
    </section>
  );
}

function QuickActions() {
  const t = useT(app);
  const [lang] = useLang();
  const { state } = useDemo();
  const plan = state.user ? state.plans.find((p) => !planSummary(p).complete) : undefined;
  const next = plan ? planSummary(plan).nextDueDate : null;

  const items: { icon: AppIconName; title: string; sub: string; href: string; site?: boolean }[] = [
    {
      icon: "passbook", title: t("qaPay"), href: routes.app.scheme(),
      sub: plan && next ? t("qaPaySub", { amount: formatINR(plan.monthly), date: formatDate(next, lang, { year: false }) }) : t("qaPaySubNone", { min: formatINR(SCHEME.minMonthly) }),
    },
    { icon: "coin", title: t("qaDigi"), href: `${routes.app.scheme()}?tab=digi`, sub: t("qaDigiSub", { min: formatINR(SCHEME.digiMinRupees), rate: formatINR(RATES.g24) }) },
    { icon: "sketch", title: t("qaCustom"), href: routes.custom(), site: true, sub: t("qaCustomSub", { off: formatINR(OFFER.prebookOffPerGram) }) },
    { icon: "scale", title: t("qaSell"), href: routes.sellGold(), site: true, sub: t("qaSellSub", { rate: formatINR(PURCHASE_RATES.g22) }) },
  ];

  return (
    <section aria-labelledby="qa-title" className="mx-4 mt-6">
      <h2 id="qa-title" className="sr-only">{t("quickTitle")}</h2>
      <ul className="grid grid-cols-2 border-l border-t border-gold/45">
        {items.map((it) => {
          const L = it.site ? SiteLink : Link;
          return (
            <li key={it.title} className="border-b border-r border-gold/45">
              <L href={it.href} className="flex h-full min-h-[104px] flex-col px-3.5 py-3.5 hover:bg-gold/[0.07] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold">
                <AppIcon name={it.icon} size={26} className="text-maroon" />
                <span className="mt-2 font-display text-[1.15rem] font-semibold leading-tight text-maroon-deep">{it.title}</span>
                <span className="mt-0.5 text-[12.5px] leading-snug text-ink/60 num">{it.sub}</span>
              </L>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function LatestOrder() {
  const t = useT(app);
  const k = useT(checkout);
  const { state } = useDemo();
  const titleOf = useOrderTitle();
  const statusOf = useShownStatus();
  const order = [...state.orders].reverse().find((o) => o.status !== ORDER_STEPS.at(-1));
  if (!order) return null;
  return (
    <section className="mx-4 mt-8">
      <Link href={routes.app.order(order.id)} className="flex items-center gap-3 border-y border-gold/45 py-3.5 focus-visible:outline-2 focus-visible:outline-gold">
        <AppIcon name="orders" size={24} className="shrink-0 text-maroon" />
        <span className="min-w-0 flex-1">
          <span className="block text-[12.5px] text-ink/55">{t("latestOrder", { id: order.id })}</span>
          <span className="block truncate font-display text-[1.1rem] font-semibold text-maroon-deep">{titleOf(order).title}</span>
        </span>
        <span className="shrink-0 text-[13px] font-medium text-emerald">{k(statusKey(statusOf(order)))}</span>
        <Icon name="chevron-right" size={18} className="shrink-0 text-maroon/50" />
      </Link>
    </section>
  );
}
