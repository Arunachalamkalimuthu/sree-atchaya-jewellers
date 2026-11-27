"use client";
import Link from "next/link";
import { OFFER, PURCHASE_RATES, RATES, SCHEME, SITE } from "@/lib/site.config";
import { PRODUCTS } from "@/lib/catalog";
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
import { AppProductTile } from "./AppProductTile";
import { AppIcon, type AppIconName } from "./AppIcons";
import { SiteButton, SiteLink } from "./frame";
import { statusKey } from "./order-labels";
import { useOrderTitle, useShownStatus } from "./OrdersScreen";

const card = "rounded-[12px] border border-[#ECE6DF] bg-white";
const h2 = "text-[18px] font-semibold text-ink";

export function HomeScreen() {
  const t = useT(app);
  const [lang] = useLang();
  const { state } = useDemo();
  const first = state.user?.name.split(" ")[0];

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-xl pb-8">
        <OffersCarousel />
        <div className="px-4 pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[20px] font-semibold leading-tight text-ink">{first ? t("greet", { name: first }) : t("greetAnon")}</p>
            <p className="shrink-0 text-[13px] text-[#6B5E57]">{t("today", { date: formatDate(SITE.ratesDate, lang, { year: false }) })}</p>
          </div>
          <RateCard className="mt-3" />
        </div>
        <SchemeCard />
        <QuickActions />
        <NewArrivals />
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
      <section className={`mx-4 mt-5 px-4 py-4 ${card}`}>
        <h2 className={h2}>{t("demoTitle")}</h2>
        <p className="mt-1 text-[14px] leading-snug text-[#6B5E57] num">
          {t("demoBody", { paid: seedPlan.paidCount, months: SCHEME.months, g: digiBalance(demoSeed.digi) })}
        </p>
        <Button variant="maroon" full className="mt-3.5" onClick={() => dispatch({ type: "signInDemo" })}>{t("demoCta")}</Button>
      </section>
    );
  }

  const plan = state.plans.find((p) => !planSummary(p).complete) ?? state.plans.at(-1);
  if (!plan) {
    return (
      <section className={`mx-4 mt-5 px-4 py-4 ${card}`}>
        <h2 className={h2}>{t("ringNoPlanTitle")}</h2>
        <p className="mt-1 text-[14px] leading-snug text-[#6B5E57]">{t("ringNoPlan", { months: SCHEME.months })}</p>
        <SiteButton href={routes.schemeJoin("monthly")} className="mt-3.5">{t("ringJoin")}</SiteButton>
      </section>
    );
  }

  const s = planSummary(plan);
  return (
    <section aria-labelledby="ring-title" className={`mx-4 mt-5 ${card}`}>
      <Link href={routes.app.scheme()} className="flex items-center gap-4 rounded-[12px] px-4 py-3.5 focus-visible:outline-2 focus-visible:outline-gold">
        <ProgressRing value={s.paidCount} total={SCHEME.months} size={88} label={t("ringLabel", { n: s.paidCount, total: SCHEME.months })} />
        <div className="min-w-0 flex-1">
          <h2 id="ring-title" className="text-[16px] font-semibold leading-tight text-ink">{t("ringTitle")}</h2>
          <p className="mt-0.5 text-[13.5px] text-[#6B5E57] num">{t("ringPlan", { amount: formatINR(plan.monthly) })}</p>
          <p className="mt-1 text-[13.5px] font-medium leading-snug text-maroon num" data-testid="home-next">
            {s.complete ? t("ringDone", { months: SCHEME.months }) : t("ringNext", { n: s.paidCount + 1, date: formatDate(s.nextDueDate!, lang) })}
          </p>
        </div>
        <Icon name="chevron-right" size={18} className="shrink-0 text-[#A39890]" />
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
    <section aria-labelledby="qa-title" className="mx-4 mt-5">
      <h2 id="qa-title" className="sr-only">{t("quickTitle")}</h2>
      <ul className="grid grid-cols-2 gap-2.5">
        {items.map((it) => {
          const L = it.site ? SiteLink : Link;
          return (
            <li key={it.title}>
              <L href={it.href} className={`flex h-full min-h-[98px] flex-col px-3.5 py-3 hover:border-[#D9D0C7] focus-visible:outline-2 focus-visible:outline-gold ${card}`}>
                <AppIcon name={it.icon} size={24} className="text-maroon" />
                <span className="mt-1.5 text-[15px] font-semibold leading-tight text-ink">{it.title}</span>
                <span className="mt-0.5 text-[12.5px] leading-snug text-[#6B5E57] num">{it.sub}</span>
              </L>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function NewArrivals() {
  const t = useT(app);
  const list = PRODUCTS.filter((p) => p.isNew);
  return (
    <section aria-labelledby="new-title" className="mt-7">
      <div className="flex items-baseline justify-between px-4">
        <h2 id="new-title" className={h2}>{t("newArrivals")}</h2>
        <Link href={routes.app.shop()} className="text-[14px] font-medium text-maroon focus-visible:outline-2 focus-visible:outline-gold">{t("seeAll")}</Link>
      </div>
      <ul className="mt-3 flex snap-x gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {list.map((p) => (
          <li key={p.slug} className="w-[42%] max-w-[180px] shrink-0 snap-start">
            <AppProductTile product={p} />
          </li>
        ))}
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
    <section className="mx-4 mt-7">
      <Link href={routes.app.order(order.id)} className={`flex items-center gap-3 px-3.5 py-3 focus-visible:outline-2 focus-visible:outline-gold ${card}`}>
        <AppIcon name="orders" size={24} className="shrink-0 text-maroon" />
        <span className="min-w-0 flex-1">
          <span className="block text-[12.5px] text-[#6B5E57]">{t("latestOrder", { id: order.id })}</span>
          <span className="block truncate text-[15px] font-semibold text-ink">{titleOf(order).title}</span>
        </span>
        <span className="shrink-0 text-[13px] font-medium text-maroon">{k(statusKey(statusOf(order)))}</span>
        <Icon name="chevron-right" size={18} className="shrink-0 text-[#A39890]" />
      </Link>
    </section>
  );
}
