"use client";
import { useEffect, useRef, useState } from "react";
import { MARKET_SELL_25NOV, OFFER, PURCHASE_RATES, RATES } from "@/lib/site.config";
import { PRODUCTS } from "@/lib/catalog";
import { formatINR, priceBreakdown } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { BANNERS } from "@/lib/images";
import { formatDate, useLang, useT } from "@/lib/i18n";
import { home } from "@/lib/i18n/dict/home";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useMedia } from "./useMedia";

/** The day the market selling rates in MARKET_SELL_25NOV were posted (the constant's name carries it). */
const MARKET_SELL_DATE = "2026-11-25";
const ADVANCE_MS = 6000;
const COINS = PRODUCTS.filter((p) => p.category === "coin").sort((a, b) => a.weightG - b.weightG);

interface Slide { key: string; src: string; focal: string; headline: string; detail: string; cta: string; href: string }

/**
 * The home banner slider: four photo banners (pre-book, gold release, old gold, coins), each with one headline, one
 * line of detail and one button. A scroll-snap track, so phones swipe natively. Auto-advances every 6 s; pauses while
 * hovered or focused, or with the pause button; never moves under reduced motion. Dots and arrows.
 */
export function HeroSlider() {
  const t = useT(home);
  const [lang] = useLang();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const reduce = useMedia("(prefers-reduced-motion: reduce)");

  const [c1, c2] = COINS;
  const slides: Slide[] = [
    {
      key: "prebook", src: BANNERS.prebook, focal: "72% 50%", href: routes.custom(), cta: t("slPrebookCta"),
      headline: t("slPrebookTitle", { offer: formatINR(RATES.g22 - OFFER.prebookOffPerGram) }),
      detail: t("slPrebookDetail", { rate: formatINR(RATES.g22), wastage: OFFER.wastagePct, gst: OFFER.gstPct }),
    },
    {
      key: "release", src: BANNERS.bridal, focal: "78% 30%", href: routes.sellGold(), cta: t("slReleaseCta"),
      headline: t("slReleaseTitle"), detail: t("slReleaseDetail"),
    },
    {
      key: "oldgold", src: BANNERS.oldgold, focal: "75% 50%", href: routes.sellGold(), cta: t("slOldCta"),
      headline: t("slOldTitle", { rate: formatINR(PURCHASE_RATES.g22) }),
      detail: t("slOldDetail", { market: formatINR(MARKET_SELL_25NOV.g22), date: formatDate(MARKET_SELL_DATE, lang, { year: false }) }),
    },
    {
      key: "coins", src: BANNERS.coins, focal: "75% 50%", href: routes.shop("coin"), cta: t("slCoinCta"),
      headline: t("slCoinTitle"),
      detail: t("slCoinDetail", {
        g1: c1.weightG, p1: formatINR(priceBreakdown(c1, "buy").total), g2: c2.weightG, p2: formatINR(priceBreakdown(c2, "buy").total), gst: OFFER.gstPct,
      }),
    },
  ];
  const total = slides.length;
  const running = !reduce && !paused && !hover && !focus;

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = (i + total) % total;
    el.scrollTo({ left: n * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
    setActive(n);
  };
  const goToRef = useRef(goTo);
  useEffect(() => { goToRef.current = goTo; });

  // One timer per shown slide: any change (dot, arrow, swipe) restarts the 6 s.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => goToRef.current(active + 1), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [running, active]);

  const onScroll = () => {
    const el = track.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active && i >= 0 && i < total) setActive(i);
  };

  const ctrl = "grid place-items-center rounded-full bg-white text-maroon shadow-[0_1px_6px_rgba(0,0,0,.25)] transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("slLabel")}
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false); }}
    >
      <div ref={track} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
        {slides.map((s, i) => (
          <div
            key={s.key}
            role="group"
            aria-roledescription="slide"
            aria-label={t("slGoTo", { n: i + 1, total })}
            inert={i !== active}
            className="w-full shrink-0 snap-start snap-always"
          >
            <Banner
              size="hero"
              src={s.src}
              focal={s.focal}
              eager={i === 0}
              as={i === 0 ? "h1" : "h2"}
              headline={s.headline}
              detail={s.detail}
              action={(photo) => <Button href={s.href} variant={photo ? "light" : "maroon"} size="lg">{s.cta}</Button>}
              className="h-[500px] sm:h-[440px] lg:h-[520px]"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 sm:bottom-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 sm:px-4 lg:px-6">
          <div className="pointer-events-auto flex items-center gap-0.5">
            {slides.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={t("slGoTo", { n: i + 1, total })}
                aria-current={i === active ? "true" : undefined}
                className="grid h-8 w-7 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-gold"
              >
                <span className={`block h-[3px] rounded-full shadow-[0_0_0_1px_rgba(0,0,0,.12)] transition-[width,background-color] duration-300 motion-reduce:transition-none ${i === active ? "w-6 bg-white" : "w-3 bg-white/55"}`} />
              </button>
            ))}
            {!reduce && (
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                aria-label={paused ? t("slPlay") : t("slPause")}
                className="ml-1 grid size-8 place-items-center rounded-full text-white [filter:drop-shadow(0_0_2px_rgba(0,0,0,.5))] focus-visible:outline-2 focus-visible:outline-gold"
              >
                <Icon name={paused ? "play" : "pause"} size={14} fill={paused ? "currentColor" : "none"} />
              </button>
            )}
          </div>
          <div className="pointer-events-auto hidden gap-2 md:flex">
            <Arrow side="left" label={t("slPrev")} onClick={() => goTo(active - 1)} className={ctrl} />
            <Arrow side="right" label={t("slNext")} onClick={() => goTo(active + 1)} className={ctrl} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow({ side, label, onClick, className }: { side: "left" | "right"; label: string; onClick: () => void; className: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`size-10 ${className}`}
    >
      <Icon name={side === "left" ? "chevron-left" : "chevron-right"} size={20} />
    </button>
  );
}
