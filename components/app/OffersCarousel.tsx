"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OFFER, PURCHASE_RATES, RATES, SCHEME } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { asset } from "@/lib/asset";
import { useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { SiteLink } from "./frame";

const AUTO_MS = 6000;
const cta =
  "mt-2.5 inline-flex min-h-9 items-center rounded-[4px] bg-maroon px-3.5 text-[13.5px] font-semibold text-white hover:bg-maroon-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function scrollToSlide(el: HTMLElement | null, i: number) {
  const card = el?.children[i] as HTMLElement | undefined;
  if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 16, behavior: "smooth" });
}

function Banner({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null; // the warm dark field behind stays, so the white text still reads
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(src)} alt="" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />;
}

/**
 * `<OffersCarousel />`: today's offers as photo banners at the top of the app home (the Canva banners in
 * public/images/banners). One headline, one line of real figures and one button per slide. Swipe with snap,
 * dots below. Auto-advances every 6 s, paused while touched, hovered or focused, and off under reduced motion.
 */
export function OffersCarousel() {
  const t = useT(app);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const track = useRef<HTMLUListElement>(null);

  const slides = [
    {
      img: "/images/banners/hero-prebook.jpg",
      title: t("offerPrebookTitle", { price: formatINR(RATES.g22 - OFFER.prebookOffPerGram) }),
      line: t("bnPrebookLine", { rate: formatINR(RATES.g22) }),
      action: <SiteLink href={routes.custom()} className={cta}>{t("offerPrebookCta")}</SiteLink>,
    },
    {
      img: "/images/banners/hero-coins.jpg",
      title: t("offerCoinTitle"),
      line: t("bnCoinLine", { rate: formatINR(RATES.g24) }),
      action: <Link href={routes.app.shop("coin")} className={cta}>{t("offerCoinCta")}</Link>,
    },
    {
      img: "/images/banners/hero-oldgold.jpg",
      title: t("bnGoldTitle"),
      line: t("bnGoldLine", { rate: formatINR(PURCHASE_RATES.g22) }),
      action: <SiteLink href={routes.sellGold()} className={cta}>{t("offerSellCta")}</SiteLink>,
    },
    {
      img: "/images/banners/scheme.jpg",
      title: t("ringNoPlanTitle"),
      line: t("bnSchemeLine", { months: SCHEME.months }),
      action: <Link href={routes.app.scheme()} className={cta}>{t("ringOpen")}</Link>,
    },
  ];

  const go = (i: number) => scrollToSlide(track.current, i);
  const onScroll = () => {
    const el = track.current;
    if (!el || !el.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 10;
    setActive(Math.max(0, Math.min(slides.length - 1, Math.round(el.scrollLeft / w))));
  };

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => scrollToSlide(track.current, (active + 1) % slides.length), AUTO_MS);
    return () => window.clearInterval(id);
  }, [active, paused, slides.length]);

  return (
    <section aria-label={t("offersTitle")} aria-roledescription="carousel" className="pt-4">
      <ul
        ref={track}
        onScroll={onScroll}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <li
            key={s.img}
            aria-roledescription="slide"
            aria-label={t("offersDot", { n: i + 1, total: slides.length })}
            className="relative aspect-[16/10] w-full shrink-0 snap-start overflow-hidden rounded-[12px] bg-[#3b2a23]"
          >
            <Banner src={s.img} />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <h2 className="text-[20px] font-semibold leading-tight num">{s.title}</h2>
              <p className="mt-1 max-w-[30ch] text-[13px] leading-snug text-white/90 num">{s.line}</p>
              {s.action}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-center gap-0.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={t("offersDot", { n: i + 1, total: slides.length })}
            aria-current={i === active ? "true" : undefined}
            className="grid size-6 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-gold"
          >
            <span className={`block h-1.5 rounded-full transition-[width,background-color] ${i === active ? "w-4 bg-maroon" : "w-1.5 bg-[#D9D0C7]"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
