"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { AppIcon, type AppIconName } from "./AppIcons";

type Tab = { id: "home" | "shop" | "scheme" | "orders" | "profile"; href: string; icon: AppIconName; label: "tabHome" | "tabShop" | "tabScheme" | "tabOrders" | "tabProfile"; match: string[] };

const TABS: Tab[] = [
  { id: "home", href: routes.app.home(), icon: "home", label: "tabHome", match: [] },
  { id: "shop", href: routes.app.shop(), icon: "shop", label: "tabShop", match: ["/app/shop", "/app/product"] },
  { id: "scheme", href: routes.app.scheme(), icon: "scheme", label: "tabScheme", match: ["/app/scheme"] },
  { id: "orders", href: routes.app.orders(), icon: "orders", label: "tabOrders", match: ["/app/orders"] },
  { id: "profile", href: routes.app.profile(), icon: "profile", label: "tabProfile", match: ["/app/profile"] },
];

export function activeTab(pathname: string): Tab["id"] {
  const p = pathname.replace(/\/+$/, "");
  return TABS.find((t) => t.match.some((m) => p === m || p.startsWith(`${m}/`)))?.id ?? "home";
}

/**
 * `<TabBar>`: the app's bottom navigation, five tabs on maroon-deep. The active tab is gold-light with a short gold
 * rule above it. Tamil labels are kept short and may wrap to two lines at 11 px; they never overflow at 360 px.
 */
export function TabBar() {
  const t = useT(app);
  const current = activeTab(usePathname() ?? "/app/");
  return (
    <nav
      aria-label={t("tabsLabel")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/35 bg-maroon-deep pb-[var(--home-ind)]"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {TABS.map((tab) => {
          const on = tab.id === current;
          return (
            <li key={tab.id} className="min-w-0">
              <Link
                href={tab.href}
                aria-current={on ? "page" : undefined}
                className={`relative flex min-h-[58px] flex-col items-center justify-start gap-1 px-0.5 pt-2 pb-1.5 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold ${
                  on ? "text-gold-light" : "text-ivory/60 hover:text-ivory/85"
                }`}
              >
                <span aria-hidden className={`absolute inset-x-[30%] top-0 h-[2px] ${on ? "bg-gold" : "bg-transparent"}`} />
                <AppIcon name={tab.icon} size={23} strokeWidth={on ? 1.7 : 1.4} />
                <span className={`line-clamp-2 w-full break-words text-center text-[11px] leading-[1.15] ${on ? "font-semibold" : ""}`}>{t(tab.label)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
