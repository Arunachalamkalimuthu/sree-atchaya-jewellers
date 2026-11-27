"use client";
import { PURCHASE_RATES, SCHEME } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { BANNERS } from "@/lib/images";
import { useT } from "@/lib/i18n";
import { home } from "@/lib/i18n/dict/home";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";

/** Two photo banners side by side: the gold savings scheme, and sell old gold / release pledged gold. */
export function PromoPair() {
  const t = useT(home);
  const box = "h-[300px] rounded-[6px] sm:h-[320px] lg:h-[340px]";
  return (
    <section aria-label={`${t("prSchemeTitle")}, ${t("prSellTitle")}`} className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 sm:py-10 md:grid-cols-2 lg:gap-6 lg:px-8">
      <Banner
        src={BANNERS.scheme}
        focal="80% 50%"
        className={box}
        headline={t("prSchemeTitle")}
        detail={t("prSchemeDetail", {
          min: formatINR(SCHEME.minMonthly), max: formatINR(SCHEME.maxMonthly), months: SCHEME.months, bonus: SCHEME.bonusInstalments,
        })}
        action={(photo) => <Button href={routes.scheme()} variant={photo ? "light" : "maroon"}>{t("prSchemeCta")}</Button>}
      />
      <Banner
        src={BANNERS.showroom}
        focal="70% 50%"
        className={box}
        headline={t("prSellTitle")}
        detail={t("prSellDetail", { rate: formatINR(PURCHASE_RATES.g22) })}
        action={(photo) => <Button href={routes.sellGold()} variant={photo ? "light" : "maroon"}>{t("prSellCta")}</Button>}
      />
    </section>
  );
}
