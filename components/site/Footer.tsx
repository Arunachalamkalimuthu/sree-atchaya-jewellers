"use client";
import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/lib/site.config";
import { routes } from "@/lib/routes";
import { CATEGORIES } from "@/lib/catalog";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { Wordmark } from "@/components/brand/Wordmark";
import { GoldRule } from "@/components/brand/GoldRule";
import { ContactSheet, type ContactTopic } from "@/components/ui/ContactSheet";
import { Icon } from "@/components/ui/Icon";

const SHOP_CATS = ["necklace", "haaram", "temple", "bangle", "chain", "coin", "silver"] as const;

/** Site footer on maroon-deep: showroom, hours, numbers as text, Instagram handle as text, links, demo disclaimer. */
export function Footer() {
  const t = useT(common);
  const l = useL10n();
  const [topic, setTopic] = useState<ContactTopic | null>(null);

  const phones: { label: string; number: string }[] = [
    { label: t("footerMainRelease"), number: SITE.phones.main },
    { label: t("contactAlt"), number: SITE.phones.alt },
    { label: t("footerGoldCoins"), number: SITE.phones.goldCoins },
  ];
  const linkCls = "rounded-sm text-ivory/75 transition-colors hover:text-gold-light focus-visible:outline-2 focus-visible:outline-gold";

  return (
    <footer className="bg-maroon-deep text-ivory">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_0.9fr] lg:gap-12">
          <div>
            <span className="sm:hidden"><Wordmark tone="ivory" size="md" /></span>
            <span className="hidden sm:block"><Wordmark tone="ivory" size="lg" /></span>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ivory/75">{t("footerIntro")}</p>
            <p className="mt-5 flex items-center gap-2 text-[15px] text-ivory/85">
              <Icon name="instagram" size={18} className="text-gold" />
              <span>{t("footerInstagram")}</span>
              <span className="text-gold-light">@{SITE.instagram}</span>
            </p>
          </div>

          <div id="showroom">
            <h2 className="font-display text-xl font-semibold text-gold-light">{t("footerVisit")}</h2>
            <address className="mt-4 not-italic text-[15px] leading-relaxed text-ivory/80">
              {t("brandName")} {t("brandSub")}<br />
              {t("footerAddress", { pin: SITE.address.pin })}
            </address>
            <p className="mt-3 flex items-center gap-2 text-[15px] text-ivory/80"><Icon name="clock" size={17} className="text-gold" />{t("footerHours")}</p>
            <ul className="mt-6 space-y-3.5">
              {phones.map((p) => (
                <li key={p.label}>
                  <p className="text-[13px] text-ivory/55">{p.label}</p>
                  <p className="font-display text-[1.3rem] font-semibold tracking-wide text-ivory num">{p.number}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setTopic("general")}
              className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-gold/55 px-4 text-sm text-gold-light transition-colors hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-gold"
            >
              <Icon name="phone" size={16} />
              {t("footerTalk")}
            </button>
          </div>

          <nav aria-labelledby="footer-shop">
            <h2 id="footer-shop" className="font-display text-xl font-semibold text-gold-light">{t("footerShop")}</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {SHOP_CATS.map((id) => {
                const c = CATEGORIES.find((x) => x.id === id)!;
                return <li key={id}><Link href={routes.shop(id)} className={linkCls}>{l(c)}</Link></li>;
              })}
              <li><Link href={routes.shop()} className={linkCls}>{t("footerAllJewellery")}</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className="font-display text-xl font-semibold text-gold-light">{t("footerServices")}</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li><Link href={routes.scheme()} className={linkCls}>{t("svcScheme")}</Link></li>
              <li><Link href={routes.custom()} className={linkCls}>{t("svcCustom")}</Link></li>
              <li><Link href={routes.sellGold()} className={linkCls}>{t("svcSell")}</Link></li>
              <li><Link href={routes.sellGold()} className={linkCls}>{t("svcRelease")}</Link></li>
              <li><Link href={routes.shop("coin")} className={linkCls}>{t("svcCoins")}</Link></li>
            </ul>
          </nav>
        </div>

        <GoldRule className="mt-12 text-gold/70" />

        <div role="note" className="mx-auto mt-8 max-w-3xl text-center">
          <h2 className="font-display text-lg font-semibold text-gold-light">{t("footerDemoTitle")}</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ivory/65">{t("footerDemo")}</p>
        </div>
      </div>
      <ContactSheet open={topic !== null} onClose={() => setTopic(null)} topic={topic ?? "general"} />
    </footer>
  );
}
