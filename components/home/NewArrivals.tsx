"use client";
import { PRODUCTS } from "@/lib/catalog";
import { OFFER, RATES } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n";
import { home } from "@/lib/i18n/dict/home";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHead } from "./SectionHead";

const NEW = PRODUCTS.filter((p) => p.isNew).slice(0, 8);

/** Eight new pieces. Phones: one row that scrolls sideways. From 1024 px: four across, two rows. */
export function NewArrivals() {
  const t = useT(home);
  return (
    <section aria-labelledby="new-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <SectionHead
        id="new-title"
        title={t("newTitle")}
        intro={t("newIntro", { rate: formatINR(RATES.g22), pct: OFFER.gstPct })}
        link={{ href: routes.shop(), label: t("newAll") }}
      />
      <ul className="-mx-4 mt-8 grid auto-cols-[64%] grid-flow-col gap-x-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:auto-cols-[40%] sm:px-6 lg:mx-0 lg:grid-flow-row lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {NEW.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
