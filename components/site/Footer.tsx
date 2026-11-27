"use client";
import Link from "next/link";
import { useState } from "react";
import { ADDRESS_VARS, SITE } from "@/lib/site.config";
import { routes } from "@/lib/routes";
import { CATEGORIES } from "@/lib/catalog";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { Wordmark } from "@/components/brand/Wordmark";
import { ContactSheet, type ContactTopic } from "@/components/ui/ContactSheet";
import { Icon } from "@/components/ui/Icon";

const SHOP_CATS = ["necklace", "haaram", "temple", "bangle", "chain", "coin", "silver"] as const;

/** Site footer (v2): maroon, four plain columns (about, jewellery, services, showroom with numbers as text), then the preview note. */
export function Footer() {
  const t = useT(common);
  const l = useL10n();
  const [topic, setTopic] = useState<ContactTopic | null>(null);

  const phones: { label: string; number: string }[] = [
    { label: t("contactEnquiry"), number: SITE.phones.enquiry },
    { label: t("footerMainRelease"), number: SITE.phones.main },
    { label: t("contactAlt"), number: SITE.phones.alt },
    { label: t("footerGoldCoins"), number: SITE.phones.goldCoins },
  ];
  const linkCls = "rounded-sm text-white/75 transition-colors hover:text-white hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-gold";
  const head = "text-[15px] font-semibold text-white";

  return (
    <footer className="bg-maroon text-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.2fr] lg:gap-12">
          <div>
            <Wordmark tone="ivory" size="md" />
            <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-white/75">{t("footerIntro")}</p>
            <ul className="mt-4 space-y-2 text-[14.5px] text-white/85">
              <li className="flex flex-wrap items-center gap-x-2">
                <Icon name="instagram" size={18} className="text-gold-light" />
                <span>{t("footerInstagram")}</span>
                <span className="select-all font-medium text-white">@{SITE.social.instagram}</span>
              </li>
              <li className="flex flex-wrap items-center gap-x-2">
                <Icon name="facebook" size={18} className="text-gold-light" />
                <span>{t("footerFacebook")}</span>
                <span className="select-all font-medium text-white">{SITE.social.facebook}</span>
              </li>
            </ul>
            <p className="mt-2 text-[13px] text-white/60">{t("footerFollowers", { ig: SITE.social.instagramFollowers, fb: SITE.social.facebookFollowers })}</p>
          </div>

          <nav aria-labelledby="footer-shop">
            <h2 id="footer-shop" className={head}>{t("footerShop")}</h2>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              {SHOP_CATS.map((id) => {
                const c = CATEGORIES.find((x) => x.id === id)!;
                return <li key={id}><Link href={routes.shop(id)} className={linkCls}>{l(c)}</Link></li>;
              })}
              <li><Link href={routes.shop()} className={linkCls}>{t("footerAllJewellery")}</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className={head}>{t("footerServices")}</h2>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              <li><Link href={routes.scheme()} className={linkCls}>{t("svcScheme")}</Link></li>
              <li><Link href={routes.custom()} className={linkCls}>{t("svcCustom")}</Link></li>
              <li><Link href={routes.sellGold()} className={linkCls}>{t("svcSell")}</Link></li>
              <li><Link href={routes.sellGold()} className={linkCls}>{t("svcRelease")}</Link></li>
              <li><Link href={routes.shop("coin")} className={linkCls}>{t("svcCoins")}</Link></li>
              <li><Link href={routes.account()} className={linkCls}>{t("account")}</Link></li>
            </ul>
          </nav>

          <div id="showroom">
            <h2 className={head}>{t("footerVisit")}</h2>
            <address className="mt-4 not-italic text-[14.5px] leading-relaxed text-white/80">
              {t("brandName")} {t("brandSub")}<br />
              {t("footerAddress", ADDRESS_VARS)}
            </address>
            <p className="mt-2 flex items-center gap-2 text-[14.5px] text-white/80">
              <Icon name="mail" size={16} className="shrink-0 text-gold-light" />
              <span className="sr-only">{t("footerEmail")}</span>
              <span className="min-w-0 select-all break-all">{SITE.email}</span>
            </p>
            <p className="mt-2 flex items-center gap-2 text-[14.5px] text-white/80"><Icon name="clock" size={16} className="text-gold-light" />{t("footerHours")}</p>
            <ul className="mt-5 space-y-2.5">
              {phones.map((p) => (
                <li key={p.label} className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-white/15 pb-2.5">
                  <span className="text-[13px] text-white/65">{p.label}</span>
                  <span className="whitespace-nowrap text-[15px] font-semibold tracking-wide text-white tabular-nums">{p.number}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setTopic("general")}
              className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-[4px] border border-white/60 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-gold"
            >
              <Icon name="phone" size={16} />
              {t("footerTalk")}
            </button>
          </div>
        </div>

        <div role="note" className="mt-12 border-t border-white/20 pt-6 text-[12.5px] leading-relaxed text-white/60">
          <span className="font-semibold text-white/80">{t("footerDemoTitle")}.</span> {t("footerDemo")}
        </div>
      </div>
      <ContactSheet open={topic !== null} onClose={() => setTopic(null)} topic={topic ?? "general"} />
    </footer>
  );
}
