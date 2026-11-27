"use client";
import Link from "next/link";
import { OFFER, PURCHASE_RATES, RATES, SITE } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { home } from "@/lib/i18n/dict/home";

/**
 * A full-bleed maroon band of the counter's services. Gold release and cash for old gold lead (the shop calls
 * itself a gold and pawn shop); custom designs and coins follow. Text and rules only: no icon circles.
 */
export function ServicesStrip() {
  const t = useT(home);
  const c = useT(common);
  const items = [
    { key: "release", title: c("svcRelease"), body: t("svcReleaseBody"), cta: t("svcReleaseCta"), href: routes.sellGold(), lead: true, phone: SITE.phones.goldRelease },
    { key: "sell", title: c("svcSell"), body: t("svcSellBody", { rate: formatINR(PURCHASE_RATES.g22) }), cta: t("svcSellCta"), href: routes.sellGold(), lead: true },
    { key: "custom", title: c("svcCustom"), body: t("svcCustomBody", { rate: formatINR(RATES.g22 - OFFER.prebookOffPerGram) }), cta: t("svcCustomCta"), href: routes.custom() },
    { key: "coins", title: c("svcCoins"), body: t("svcCoinsBody", { rate: formatINR(RATES.g24) }), cta: t("svcCoinsCta"), href: routes.shop("coin") },
  ];

  return (
    <section aria-labelledby="services-title" className="bg-maroon text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 id="services-title" className="font-display text-[1.95rem] font-semibold leading-[1.1] text-ivory sm:text-[2.5rem]">{t("svcTitle")}</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ivory/70">{t("svcIntro")}</p>

        <ul className="mt-9 grid gap-x-0 sm:grid-cols-2 lg:grid-cols-[1.25fr_1.25fr_1fr_1fr]">
          {items.map((s, i) => (
            <li
              key={s.key}
              className={`flex flex-col border-t border-gold/40 py-6 sm:pr-6 lg:py-1 lg:pt-6 ${i % 2 === 1 ? "sm:border-l sm:pl-6" : ""} ${i === 2 ? "lg:border-l lg:pl-6" : ""}`}
            >
              <h3 className={`font-display font-semibold leading-tight ${s.lead ? "text-[1.6rem] text-gold-light" : "text-[1.4rem] text-ivory"}`}>{s.title}</h3>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ivory/78">{s.body}</p>
              {s.phone && (
                <p className="mt-3">
                  <span className="block text-[12.5px] text-ivory/55">{c("contactRelease")}</span>
                  <span className="font-display text-[1.35rem] font-semibold tracking-wide text-ivory num">{s.phone}</span>
                </p>
              )}
              <Link
                href={s.href}
                className="mt-4 self-start rounded-sm pb-0.5 text-[15px] text-gold-light underline decoration-gold/60 decoration-1 underline-offset-[6px] hover:decoration-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold lg:mt-auto lg:pt-4"
              >
                {s.cta}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
