"use client";
import { OFFER, PURCHASE_RATES } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { useT } from "@/lib/i18n";
import { home } from "@/lib/i18n/dict/home";
import { Icon, type IconName } from "@/components/ui/Icon";

/** Plain facts from site.config with simple line icons, on the warm off-white band. No claims beyond config. */
export function TrustStrip() {
  const t = useT(home);
  const items: { icon: IconName; title: string; body: string }[] = [
    { icon: "hallmark", title: t("trHallmarkTitle"), body: t("trHallmarkBody") },
    { icon: "percent", title: t("trWastageTitle", { pct: OFFER.wastagePct }), body: t("trWastageBody") },
    { icon: "scale", title: t("trBuyTitle", { rate: formatINR(PURCHASE_RATES.g22) }), body: t("trBuyBody") },
    { icon: "unlock", title: t("trReleaseTitle"), body: t("trReleaseBody") },
  ];
  return (
    <section aria-labelledby="trust-title" className="mt-4 border-y border-line bg-cream">
      <h2 id="trust-title" className="sr-only">{t("trTitle")}</h2>
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-7 sm:px-6 lg:grid-cols-4 lg:px-8 lg:py-8">
        {items.map((it) => (
          <li key={it.icon} className="flex items-start gap-3">
            <Icon name={it.icon} size={30} strokeWidth={1.3} className="mt-0.5 shrink-0 text-maroon" />
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold leading-snug text-ink">{it.title}</span>
              <span className="block text-[13px] leading-snug text-mute">{it.body}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
