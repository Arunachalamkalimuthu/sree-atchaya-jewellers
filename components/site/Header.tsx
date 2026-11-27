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
import { Icon } from "@/components/ui/Icon";
import { LangToggle } from "@/components/ui/LangToggle";
import { ContactSheet } from "@/components/ui/ContactSheet";
import { useModalFocus } from "@/components/ui/Sheet";
import { SearchSheet } from "./SearchSheet";

type NavKey = "navJewellery" | "navScheme" | "navCustom" | "navSellGold" | "navVisit";

/** "Visit Us" goes to the home page's #visit section (Task 5 owns that id). */
export const NAV: { key: NavKey; href: string; match?: string }[] = [
  { key: "navJewellery", href: routes.shop(), match: "/shop" },
  { key: "navScheme", href: routes.scheme(), match: "/scheme" },
  { key: "navCustom", href: routes.custom(), match: "/custom-order" },
  { key: "navSellGold", href: routes.sellGold(), match: "/sell-gold" },
  { key: "navVisit", href: `${routes.home()}#visit` },
];

/**
 * Site header (v2): white, sticky under the demo ribbon, with a gold hairline. Logo, nav, search, account, cart with
 * count, language. Below 1280px the nav moves into a drawer (Tamil labels need the width).
 */
export function Header() {
  const t = useT(common);
  const pathname = usePathname() ?? "/";
  const { state } = useDemo();
  const [menu, setMenu] = useState(false);
  const [contact, setContact] = useState(false);
  const [search, setSearch] = useState(false);
  const count = state.cart.reduce((n, l) => n + l.qty, 0);
  const isActive = (m?: string) => !!m && (pathname === m || pathname.startsWith(`${m}/`) || (m === "/shop" && pathname.startsWith("/product")));
  const iconBtn = "grid size-10 sm:size-11 place-items-center rounded-full text-ink transition-colors hover:text-maroon focus-visible:outline-2 focus-visible:outline-gold";

  return (
    <header className="sticky top-7 z-50 border-b border-gold/70 bg-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-10 focus:bg-maroon focus:px-3 focus:py-2 focus:text-white">
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex h-[64px] max-w-7xl items-center gap-2 px-4 sm:h-[72px] sm:gap-4 sm:px-6 lg:h-[80px] lg:px-8">
        <Link href={routes.home()} aria-label={t("navHome")} className="min-w-0 shrink rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
          <span className="sm:hidden"><Wordmark size="sm" /></span>
          <span className="hidden sm:block"><Wordmark size="md" /></span>
        </Link>

        <nav aria-label="Main" className="mx-auto hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => {
              const active = isActive(n.match);
              return (
                <li key={n.key}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block whitespace-nowrap rounded-sm px-3 py-2 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-gold ${
                      active ? "text-maroon" : "text-ink hover:text-maroon"
                    }`}
                  >
                    {t(n.key)}
                    {active && <span aria-hidden className="absolute inset-x-3 -bottom-[21px] h-[2px] bg-maroon" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center xl:ml-0">
          <span className="mr-2 hidden md:block"><LangToggle /></span>
          <LangToggle compact className="mr-1 max-[359px]:hidden md:hidden" />
          <button type="button" onClick={() => setSearch(true)} aria-label={t("searchOpen")} aria-haspopup="dialog" className={iconBtn}>
            <Icon name="search" size={21} />
          </button>
          <Link href={routes.account()} aria-label={t("account")} className={`hidden sm:grid ${iconBtn}`}>
            <Icon name="user" size={22} />
          </Link>
          <Link href={routes.cart()} aria-label={count ? t("cartWithCount", { n: count }) : t("cart")} className={`relative ${iconBtn}`}>
            <Icon name="bag" size={22} />
            {count > 0 && (
              <span className="absolute right-0.5 top-1 grid min-w-[18px] place-items-center rounded-full bg-maroon px-1 text-[11px] font-semibold leading-[18px] text-white tabular-nums">
                {count}
              </span>
            )}
          </Link>
          <button type="button" onClick={() => setMenu(true)} aria-label={t("menuOpen")} aria-expanded={menu} className={`-mr-2 xl:hidden ${iconBtn}`}>
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>

      <MobileMenu open={menu} onClose={() => setMenu(false)} isActive={isActive} onContact={() => { setMenu(false); setContact(true); }} />
      <ContactSheet open={contact} onClose={() => setContact(false)} />
      <SearchSheet open={search} onClose={() => setSearch(false)} />
    </header>
  );
}

function MobileMenu({ open, onClose, isActive, onContact }: { open: boolean; onClose: () => void; isActive: (m?: string) => boolean; onContact: () => void }) {
  const t = useT(common);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const lastPath = useRef(pathname);

  // Scroll lock, focus trap, Escape and focus restore: the same behaviour as Sheet.
  useModalFocus(open, panel, onClose);
  // Close when the route changes underneath (e.g. browser back). Not on mount: links already close it on click.
  useEffect(() => { onCloseRef.current = onClose; });
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    onCloseRef.current();
  }, [pathname]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[95] xl:hidden" role="dialog" aria-modal="true" aria-label={t("menuTitle")}>
      <div aria-hidden className="sa-fade absolute inset-0 bg-[#1d0d0b]/55" onClick={onClose} />
      <div ref={panel} tabIndex={-1} className="sa-drawer absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col overflow-y-auto bg-white pt-7 text-ink shadow-[-12px_0_40px_rgba(0,0,0,.18)] outline-none">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <Wordmark size="sm" />
          <button type="button" onClick={onClose} aria-label={t("menuClose")} data-autofocus className="grid size-11 place-items-center rounded-full text-ink hover:text-maroon focus-visible:outline-2 focus-visible:outline-gold">
            <Icon name="close" size={24} />
          </button>
        </div>
        <nav aria-label="Main" className="px-5 py-2">
          <ul>
            {NAV.map((n) => {
              const active = isActive(n.match);
              return (
                <li key={n.key} className="border-b border-line">
                  <Link
                    href={n.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between py-3.5 text-[17px] font-medium leading-tight focus-visible:outline-2 focus-visible:outline-gold ${active ? "text-maroon" : "text-ink"}`}
                  >
                    {t(n.key)}
                    <Icon name="chevron-right" size={18} className="text-mute" />
                  </Link>
                </li>
              );
            })}
            <li className="border-b border-line">
              <Link href={routes.account()} onClick={onClose} className="flex items-center gap-3 py-3.5 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-gold">
                <Icon name="user" size={20} className="text-maroon" />
                {t("account")}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto px-5 pb-8 pt-4">
          <p className="mb-2 text-[13px] text-mute">{t("language")}</p>
          <LangToggle />
          <button
            type="button"
            onClick={onContact}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[4px] border border-maroon/45 py-3 text-[15px] font-semibold text-maroon hover:bg-maroon/[0.04] focus-visible:outline-2 focus-visible:outline-gold"
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
