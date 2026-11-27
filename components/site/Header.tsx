"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { Wordmark } from "@/components/brand/Wordmark";
import { GoldRule } from "@/components/brand/GoldRule";
import { Icon } from "@/components/ui/Icon";
import { LangToggle } from "@/components/ui/LangToggle";
import { ContactSheet } from "@/components/ui/ContactSheet";

type NavKey = "navJewellery" | "navScheme" | "navCustom" | "navSellGold" | "navVisit";

/** "Visit Us" goes to the home page's #visit section (Task 5 owns that id). */
export const NAV: { key: NavKey; href: string; match?: string }[] = [
  { key: "navJewellery", href: routes.shop(), match: "/shop" },
  { key: "navScheme", href: routes.scheme(), match: "/scheme" },
  { key: "navCustom", href: routes.custom(), match: "/custom-order" },
  { key: "navSellGold", href: routes.sellGold(), match: "/sell-gold" },
  { key: "navVisit", href: `${routes.home()}#visit` },
];

/** Site header: maroon bar with wordmark, nav, language, account and cart. Below 1280px the nav moves into a drawer (Tamil labels need the width). */
export function Header() {
  const t = useT(common);
  const pathname = usePathname() ?? "/";
  const { state } = useDemo();
  const [menu, setMenu] = useState(false);
  const [contact, setContact] = useState(false);
  const count = state.cart.reduce((n, l) => n + l.qty, 0);
  const isActive = (m?: string) => !!m && (pathname === m || pathname.startsWith(`${m}/`) || (m === "/shop" && pathname.startsWith("/product")));

  return (
    <header className="sticky top-7 z-50 bg-maroon text-ivory shadow-[0_1px_0_rgba(201,162,74,.55)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-10 focus:bg-gold focus:px-3 focus:py-2 focus:text-maroon-deep">
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex h-[64px] max-w-7xl items-center gap-2 px-4 sm:h-[68px] sm:gap-4 sm:px-6 lg:h-[76px] lg:px-8">
        <Link href={routes.home()} aria-label={t("navHome")} className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
          <span className="sm:hidden"><Wordmark tone="ivory" size="sm" /></span>
          <span className="hidden sm:block"><Wordmark tone="ivory" size="md" /></span>
        </Link>

        <nav aria-label="Main" className="mx-auto hidden xl:block">
          <ul className="flex items-center gap-2">
            {NAV.map((n) => {
              const active = isActive(n.match);
              return (
                <li key={n.key}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block whitespace-nowrap rounded-sm px-2.5 py-2 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-gold ${
                      active ? "text-gold-light" : "text-ivory/85 hover:text-gold-light"
                    }`}
                  >
                    {t(n.key)}
                    {active && <span aria-hidden className="absolute inset-x-3 -bottom-[13px] h-[2px] bg-gold" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1 xl:ml-0">
          <span className="mr-2 hidden sm:block"><LangToggle tone="dark" /></span>
          <LangToggle tone="dark" compact className="mr-1 max-[359px]:hidden sm:hidden" />
          <IconLink href={routes.account()} label={t("account")} icon="user" className="hidden sm:grid" />
          <Link
            href={routes.cart()}
            aria-label={count ? t("cartWithCount", { n: count }) : t("cart")}
            className="relative grid size-11 place-items-center rounded-full text-ivory/90 transition-colors hover:text-gold-light focus-visible:outline-2 focus-visible:outline-gold"
          >
            <Icon name="bag" size={22} />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[11px] font-semibold leading-[18px] text-maroon-deep num">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMenu(true)}
            aria-label={t("menuOpen")}
            aria-expanded={menu}
            className="grid size-11 place-items-center rounded-full text-ivory transition-colors hover:text-gold-light focus-visible:outline-2 focus-visible:outline-gold xl:hidden"
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>

      <MobileMenu open={menu} onClose={() => setMenu(false)} isActive={isActive} onContact={() => { setMenu(false); setContact(true); }} />
      <ContactSheet open={contact} onClose={() => setContact(false)} />
    </header>
  );
}

function IconLink({ href, label, icon, className = "" }: { href: string; label: string; icon: "user" | "bag"; className?: string }) {
  return (
    <Link href={href} aria-label={label} className={`size-11 place-items-center rounded-full text-ivory/90 transition-colors hover:text-gold-light focus-visible:outline-2 focus-visible:outline-gold ${className}`}>
      <Icon name={icon} size={22} />
    </Link>
  );
}

function MobileMenu({ open, onClose, isActive, onContact }: { open: boolean; onClose: () => void; isActive: (m?: string) => boolean; onContact: () => void }) {
  const t = useT(common);
  const pathname = usePathname();
  const onCloseRef = useRef(onClose);

  // Close on navigation and on Escape; lock page scroll while open.
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => { onCloseRef.current(); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[95] xl:hidden" role="dialog" aria-modal="true" aria-label={t("menuTitle")}>
      <div aria-hidden className="sa-fade absolute inset-0 bg-maroon-deep/60" onClick={onClose} />
      <div className="sa-drawer absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col overflow-y-auto bg-maroon-deep pt-7 text-ivory shadow-[-12px_0_40px_rgba(0,0,0,.3)]">
        <div className="flex items-center justify-between border-b border-gold/30 px-5 py-4">
          <Wordmark tone="ivory" size="sm" />
          <button type="button" onClick={onClose} aria-label={t("menuClose")} autoFocus className="grid size-11 place-items-center rounded-full text-ivory hover:text-gold-light focus-visible:outline-2 focus-visible:outline-gold">
            <Icon name="close" size={24} />
          </button>
        </div>
        <nav aria-label="Main" className="px-5 py-3">
          <ul>
            {NAV.map((n) => {
              const active = isActive(n.match);
              return (
                <li key={n.key} className="border-b border-gold/15">
                  <Link
                    href={n.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between py-4 font-display text-[1.45rem] font-medium leading-tight focus-visible:outline-2 focus-visible:outline-gold ${active ? "text-gold-light" : "text-ivory"}`}
                  >
                    {t(n.key)}
                    <Icon name="chevron-right" size={18} className="text-gold/70" />
                  </Link>
                </li>
              );
            })}
            <li className="border-b border-gold/15">
              <Link href={routes.account()} onClick={onClose} className="flex items-center gap-3 py-4 text-[15px] text-ivory/85 focus-visible:outline-2 focus-visible:outline-gold">
                <Icon name="user" size={20} className="text-gold" />
                {t("account")}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto px-5 pb-8 pt-4">
          <p className="mb-2 text-[13px] text-ivory/60">{t("language")}</p>
          <LangToggle tone="dark" />
          <GoldRule className="my-6" />
          <button
            type="button"
            onClick={onContact}
            className="flex w-full items-center justify-center gap-2 rounded-[3px] border border-gold/60 py-3 text-[15px] text-gold-light hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-gold"
          >
            <Icon name="phone" size={18} />
            {t("footerCall")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
