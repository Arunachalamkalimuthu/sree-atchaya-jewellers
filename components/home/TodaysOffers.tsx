"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MARKET_SELL_25NOV, OFFER, PURCHASE_RATES, RATES, SITE } from "@/lib/site.config";
import { PRODUCTS } from "@/lib/catalog";
import { formatINR, priceBreakdown } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { home } from "@/lib/i18n/dict/home";
import { OrnateFrame } from "@/components/brand/OrnateFrame";
import { Button } from "@/components/ui/Button";
import { ContactSheet, type ContactTopic } from "@/components/ui/ContactSheet";
import { ProductImage } from "@/components/ui/ProductImage";
import { SectionHead } from "./SectionHead";
import { useMedia } from "./useMedia";
import { darkAction } from "./styles";

/** The day the market selling rates in MARKET_SELL_25NOV were posted (the constant's name carries it). */
const MARKET_SELL_DATE = "2026-11-25";
const ADVANCE_MS = 6000;
const COINS = PRODUCTS.filter((p) => p.category === "coin");

/**
 * "Today's special offers": four poster panels in the gold ornamental frame, straight under the rate board.
 * Desktop: a composed 12-column layout led by the pre-book offer, no motion. Phones: a scroll-snap row that
 * advances every 6 s, pausable, stopped by the first touch, and off under reduced motion.
 */
export function TodaysOffers() {
  const t = useT(home);
  const [topic, setTopic] = useState<ContactTopic | null>(null);
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const phone = useMedia("(max-width: 1023.98px)");
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const auto = phone && !reduce;
  const running = auto && !paused && !hold;

  const panels: { key: string; node: ReactNode; place: string }[] = [
    { key: "prebook", node: <PrebookPanel />, place: "lg:col-span-8" },
    { key: "coins", node: <CoinPanel onAsk={() => setTopic("goldCoins")} />, place: "lg:col-span-4" },
    { key: "oldgold", node: <OldGoldPanel />, place: "lg:col-span-5" },
    { key: "release", node: <ReleasePanel onAsk={() => setTopic("goldRelease")} />, place: "lg:col-span-7" },
  ];
  const total = panels.length;

  const goTo = (i: number, smooth = true) => {
    const el = track.current;
    const items = el?.children;
    if (!el || !items?.length) return;
    const first = items[0] as HTMLElement;
    const target = items[i] as HTMLElement;
    el.scrollTo({ left: target.offsetLeft - first.offsetLeft, behavior: smooth && !reduce ? "smooth" : "auto" });
  };

  const activeRef = useRef(active);
  const goToRef = useRef(goTo);
  useEffect(() => { activeRef.current = active; goToRef.current = goTo; });
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => goToRef.current((activeRef.current + 1) % total), ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [running, total]);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const base = items[0]?.offsetLeft ?? 0;
    let best = 0;
    items.forEach((c, i) => {
      if (Math.abs(c.offsetLeft - base - el.scrollLeft) < Math.abs(items[best].offsetLeft - base - el.scrollLeft)) best = i;
    });
    if (best !== active) setActive(best);
  };

  return (
    <section aria-labelledby="offers-title" aria-roledescription={phone ? "carousel" : undefined} className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead id="offers-title" title={t("offersTitle")} intro={t("offersIntro")} />
      </div>

      <ul
        ref={track}
        onScroll={onScroll}
        onPointerDown={() => auto && setPaused(true)}
        onFocus={() => setHold(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false); }}
        className="mt-7 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 sm:scroll-px-6 pb-1 [scrollbar-width:none] sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-5 lg:overflow-visible lg:px-8 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {panels.map((p, i) => (
          <li
            key={p.key}
            aria-roledescription={phone ? "slide" : undefined}
            aria-label={phone ? t("offersGoTo", { n: i + 1, total }) : undefined}
            className={`w-[86%] shrink-0 snap-start sm:w-[70%] lg:w-auto ${p.place}`}
          >
            {p.node}
          </li>
        ))}
      </ul>

      {/* Phone controls: dots and a pause button. Hidden from 1024 px, where nothing moves. */}
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:hidden">
        <div className="flex items-center gap-1">
          {panels.map((p, i) => (
            <button
              key={p.key}
              type="button"
              onClick={() => { setPaused(true); goTo(i); }}
              aria-label={t("offersGoTo", { n: i + 1, total })}
              aria-current={i === active ? "true" : undefined}
              className="grid size-8 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-gold"
            >
              <span className={`block h-[3px] transition-[width,background-color] duration-300 ${i === active ? "w-6 bg-maroon" : "w-3 bg-maroon/25"}`} />
            </button>
          ))}
        </div>
        {auto && (
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            className="inline-flex min-h-9 items-center gap-2 rounded-[3px] px-2 text-[13px] text-maroon focus-visible:outline-2 focus-visible:outline-gold"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="text-maroon">
              {paused ? <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /> : <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />}
            </svg>
            {paused ? t("offersPlay") : t("offersPause")}
          </button>
        )}
      </div>

      <ContactSheet open={topic !== null} onClose={() => setTopic(null)} topic={topic ?? "general"} />
    </section>
  );
}

/** The lead offer: pre-book custom jewellery at ₹540/g off. */
function PrebookPanel() {
  const t = useT(home);
  const c = useT(common);
  const offerRate = RATES.g22 - OFFER.prebookOffPerGram;
  return (
    <OrnateFrame tone="maroon" className="h-full">
      <div className="flex h-full gap-8">
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="font-display text-[1.65rem] font-semibold leading-tight text-ivory sm:text-[2.1rem]">{t("pbTitle")}</h3>
          <p className="mt-1 text-[15px] text-gold-light">{t("pbOff", { off: OFFER.prebookOffPerGram })}</p>

          <div className="mt-6 flex flex-wrap items-end gap-x-7 gap-y-3">
            <div>
              <p className="text-[13px] text-ivory/65">{t("pbOfferLabel")}</p>
              <p className="mt-1 whitespace-nowrap font-display text-[3rem] font-semibold leading-none text-gold-light num sm:text-[4rem] xl:text-[4.75rem]">
                {formatINR(offerRate)}
                <span className="ml-1 font-sans text-base font-normal text-ivory/60">{c("perGram")}</span>
              </p>
            </div>
            <div className="pb-1">
              <p className="text-[13px] text-ivory/65">{t("pbRegularLabel")}</p>
              <p className="mt-1 whitespace-nowrap font-display text-[1.6rem] leading-none text-ivory/60 line-through decoration-1 num sm:text-[2rem]">
                {formatINR(RATES.g22)}{c("perGram")}
              </p>
            </div>
          </div>

          <ul className="mt-6 flex flex-col divide-y divide-gold/25 border-y border-gold/35 text-[14.5px] text-ivory sm:flex-row sm:flex-wrap sm:divide-x sm:divide-y-0 sm:divide-gold/35">
            {[t("pbWastage", { pct: OFFER.wastagePct }), t("pbMaking"), t("pbGst", { pct: OFFER.gstPct })].map((f, i) => (
              <li key={i} className="py-2.5 sm:px-4 sm:first:pl-0">{f}</li>
            ))}
          </ul>
          <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ivory/75">{t("pbAdvance", { pct: OFFER.prebookAdvancePct })}</p>

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <Button href={routes.custom()} variant="gold">{t("pbCta")}</Button>
            <span className="hidden sm:contents">
              <Link href={routes.shop()} className={darkAction}>{t("pbBrowse")}</Link>
            </span>
          </div>
        </div>
        <ProductImage src="" alt="" available={false} kind="temple" className="hidden aspect-[3/4] w-[210px] shrink-0 self-center xl:block" />
      </div>
    </OrnateFrame>
  );
}

function CoinPanel({ onAsk }: { onAsk: () => void }) {
  const t = useT(home);
  const c = useT(common);
  return (
    <OrnateFrame tone="emerald" className="h-full">
      <div className="flex h-full flex-col">
        <h3 className="font-display text-[1.65rem] font-semibold leading-tight text-ivory">{t("coinTitle")}</h3>
        <p className="mt-1 text-[14px] text-ivory/70">{t("coinSub", { pct: OFFER.gstPct })}</p>
        <ul className="mt-5 divide-y divide-gold/30 border-y border-gold/30">
          {COINS.map((p) => (
            <li key={p.slug} className="flex items-baseline justify-between gap-3 py-3">
              <span className="text-[15px] text-ivory/85">{t("coinRow", { g: p.weightG })}</span>
              <span className="whitespace-nowrap font-display text-[1.75rem] font-semibold leading-none text-gold-light num">
                {formatINR(priceBreakdown(p, "buy").total)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[14px] leading-relaxed text-ivory/75">{c("contactIntroCoins")}</p>
        <div className="mt-auto pt-6">
          <button type="button" onClick={onAsk} aria-haspopup="dialog" className={darkAction}>{t("coinCta")}</button>
        </div>
      </div>
    </OrnateFrame>
  );
}

function OldGoldPanel() {
  const t = useT(home);
  const [lang] = useLang();
  const rows = [
    { label: "22K", pay: PURCHASE_RATES.g22, market: MARKET_SELL_25NOV.g22 },
    { label: "18K", pay: PURCHASE_RATES.g18, market: MARKET_SELL_25NOV.g18 },
  ];
  return (
    <OrnateFrame tone="emerald" className="h-full">
      <div className="flex h-full flex-col">
        <h3 className="font-display text-[1.65rem] font-semibold leading-tight text-ivory">{t("oldTitle")}</h3>
        <table className="mt-5 w-full border-y border-gold/30 text-left">
          <thead>
            <tr className="text-[12.5px] text-ivory/60">
              <th scope="col" className="py-2 pr-3 font-normal"><span className="sr-only">{t("oldTitle")}</span></th>
              <th scope="col" className="py-2 pr-3 font-normal">{t("oldWePay")}</th>
              <th scope="col" className="py-2 font-normal">{t("oldMarket", { date: formatDate(MARKET_SELL_DATE, lang, { year: false }) })}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/25 border-t border-gold/30">
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className="py-3 pr-3 font-display text-xl font-semibold text-ivory">{r.label}</th>
                <td className="py-3 pr-3">
                  <span className="block whitespace-nowrap font-display text-[1.75rem] font-semibold leading-none text-gold-light num">{formatINR(r.pay)}</span>
                  <span className="mt-1 block text-[12.5px] text-gold-light/85">{t("oldMore", { diff: (r.pay - r.market).toLocaleString("en-IN") })}</span>
                </td>
                <td className="py-3 align-top">
                  <span className="block whitespace-nowrap font-display text-[1.3rem] leading-none text-ivory/65 num">{formatINR(r.market)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-[14px] leading-relaxed text-ivory/75">{t("oldNote")}</p>
        <div className="mt-auto pt-6">
          <Button href={routes.sellGold()} variant="gold">{t("oldCta")}</Button>
        </div>
      </div>
    </OrnateFrame>
  );
}

function ReleasePanel({ onAsk }: { onAsk: () => void }) {
  const t = useT(home);
  const c = useT(common);
  return (
    <OrnateFrame tone="maroon" className="h-full">
      <div className="flex h-full flex-col">
        <h3 className="font-display text-[1.65rem] font-semibold leading-tight text-ivory sm:text-[1.9rem]">{c("svcRelease")}</h3>
        {/* A real sequence, so it is numbered. */}
        <ol className="mt-5 grid gap-4 lg:grid-cols-3 lg:gap-6">
          {(["relStep1", "relStep2", "relStep3"] as const).map((k, i) => (
            <li key={k} className="border-t border-gold/35 pt-3">
              <span className="font-display text-[1.6rem] font-semibold leading-none text-gold-light num">{i + 1}</span>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ivory/85">{t(k)}</p>
            </li>
          ))}
        </ol>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pt-6">
          <div>
            <p className="text-[13px] text-ivory/60">{c("contactRelease")}</p>
            <p className="mt-0.5 whitespace-nowrap font-display text-[1.75rem] font-semibold tracking-wide text-gold-light num">{SITE.phones.goldRelease}</p>
          </div>
          <button type="button" onClick={onAsk} aria-haspopup="dialog" className={darkAction}>{t("relCta")}</button>
        </div>
      </div>
    </OrnateFrame>
  );
}
