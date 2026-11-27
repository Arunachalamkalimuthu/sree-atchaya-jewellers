"use client";
import { useRef, useState, type ReactNode } from "react";
import { OFFER, PURCHASE_RATES, RATES } from "@/lib/site.config";
import { byCategory } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { common } from "@/lib/i18n/dict/common";
import { OrnateFrame, type OrnateTone } from "@/components/brand/OrnateFrame";
import { ContactSheet } from "@/components/ui/ContactSheet";
import { SiteLink } from "./frame";
import Link from "next/link";

const cta =
  "mt-5 inline-flex min-h-10 items-center rounded-[3px] border border-gold/70 px-4 text-[14px] font-medium text-gold-light hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

/**
 * `<OffersCarousel />`: today's offers as the shop's poster panels, swiped sideways with snap. Each panel is an
 * offer moment, so each sits in the gold ornamental frame (maroon and emerald, as on their posters). No autoplay.
 */
export function OffersCarousel() {
  const t = useT(app);
  const tc = useT(common);
  const [active, setActive] = useState(0);
  const [release, setRelease] = useState(false);
  const track = useRef<HTMLUListElement>(null);

  const coins = byCategory("coin").map((p) => tc("weightG", { g: p.weightG }));
  const prebookRate = RATES.g22 - OFFER.prebookOffPerGram;

  const offers: { tone: OrnateTone; title: string; body: string; action: ReactNode }[] = [
    {
      tone: "maroon",
      title: t("offerPrebookTitle", { price: formatINR(prebookRate) }),
      body: t("offerPrebookBody", { rate: formatINR(RATES.g22), price: formatINR(prebookRate), pct: OFFER.prebookAdvancePct }),
      action: <SiteLink href={routes.custom()} className={cta}>{t("offerPrebookCta")}</SiteLink>,
    },
    {
      tone: "emerald",
      title: t("offerCoinTitle"),
      body: t("offerCoinBody", { rate: formatINR(RATES.g24), weights: t("offerCoinWeights", { a: coins[0], b: coins[coins.length - 1] }) }),
      action: <Link href={routes.app.shop("coin")} className={cta}>{t("offerCoinCta")}</Link>,
    },
    {
      tone: "maroon",
      title: t("offerSellTitle", { rate: formatINR(PURCHASE_RATES.g22) }),
      body: t("offerSellBody", { g22: formatINR(PURCHASE_RATES.g22), g18: formatINR(PURCHASE_RATES.g18) }),
      action: <SiteLink href={routes.sellGold()} className={cta}>{t("offerSellCta")}</SiteLink>,
    },
    {
      tone: "emerald",
      title: t("offerReleaseTitle"),
      body: t("offerReleaseBody"),
      action: <button type="button" onClick={() => setRelease(true)} aria-haspopup="dialog" className={cta}>{t("offerReleaseCta")}</button>,
    },
  ];

  const onScroll = () => {
    const el = track.current;
    if (!el || !el.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 12;
    setActive(Math.max(0, Math.min(offers.length - 1, Math.round(el.scrollLeft / w))));
  };
  const go = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 16, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="offers-title" className="mt-9">
      <h2 id="offers-title" className="px-4 font-display text-[1.55rem] font-semibold text-maroon">{t("offersTitle")}</h2>
      <ul
        ref={track}
        onScroll={onScroll}
        className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {offers.map((o, i) => (
          <li key={i} className="w-[86%] max-w-[340px] shrink-0 snap-start" aria-roledescription="slide" aria-label={t("offersDot", { n: i + 1, total: offers.length })}>
            <OrnateFrame tone={o.tone} className="h-full [&>div:last-child]:px-6 [&>div:last-child]:py-7">
              <h3 className="font-display text-[1.6rem] font-semibold leading-[1.1] text-gold-light num">{o.title}</h3>
              <p className="mt-3 text-[14.5px] leading-snug text-ivory/90 num">{o.body}</p>
              {o.action}
            </OrnateFrame>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-center gap-1">
        {offers.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={t("offersDot", { n: i + 1, total: offers.length })}
            aria-current={i === active ? "true" : undefined}
            className="grid size-6 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-gold"
          >
            <span className={`block h-1.5 rounded-full transition-[width,background-color] ${i === active ? "w-4 bg-maroon" : "w-1.5 bg-maroon/25"}`} />
          </button>
        ))}
      </div>
      <ContactSheet open={release} onClose={() => setRelease(false)} topic="goldRelease" />
    </section>
  );
}
