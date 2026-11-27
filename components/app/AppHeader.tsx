"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { app } from "@/lib/i18n/dict/app";
import { LangToggle } from "@/components/ui/LangToggle";
import { Icon } from "@/components/ui/Icon";
import { Wordmark } from "@/components/brand/Wordmark";
import { AppIcon } from "./AppIcons";
import { SiteLink } from "./frame";

/**
 * `<AppHeader title? back? />`: the maroon app bar, title in the body font. Without `title` it shows the wordmark (home tab).
 * `back` is an app route for the back chevron. On the right: the language switch and the cart, which is the
 * website's cart (opens in the top window inside the phone frame). Sits under the status bar in the frame.
 */
export function AppHeader({ title, back, children }: { title?: string; back?: string; children?: ReactNode }) {
  const t = useT(app);
  const tc = useT(common);
  const { state } = useDemo();
  const n = state.cart.reduce((s, l) => s + l.qty, 0);

  return (
    <header className="sticky top-[var(--app-top)] z-30 bg-maroon pt-[var(--status)] text-white">
      <div className="mx-auto flex h-14 max-w-xl items-center gap-2 px-3">
        {back ? (
          <Link
            href={back}
            aria-label={t("back")}
            className="-ml-1 grid size-10 shrink-0 place-items-center rounded-full text-gold-light hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-gold"
          >
            <AppIcon name="back" size={24} />
          </Link>
        ) : null}
        <div className={`min-w-0 flex-1 ${back ? "" : "pl-1"}`}>
          {title ? (
            <h1 className="truncate text-[18px] font-semibold leading-tight text-white">{title}</h1>
          ) : (
            <Link href={routes.app.home()} className="inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-gold">
              <Wordmark tone="ivory" size="sm" />
            </Link>
          )}
        </div>
        <LangToggle tone="dark" compact />
        <SiteLink
          href={routes.cart()}
          aria-label={n ? tc("cartWithCount", { n }) : tc("cart")}
          className="relative grid size-10 shrink-0 place-items-center rounded-full text-gold-light hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-gold"
        >
          <Icon name="bag" size={22} />
          {n > 0 && (
            <span className="num absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[11px] font-semibold leading-[18px] text-maroon-deep">
              {n}
            </span>
          )}
        </SiteLink>
      </div>
      {children}
    </header>
  );
}
