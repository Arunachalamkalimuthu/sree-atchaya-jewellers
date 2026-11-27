"use client";
import { OFFER, RATES } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n";
import { home } from "@/lib/i18n/dict/home";
import { ProductRow } from "./ProductRow";
import { NEW_ROW, TEMPLE_BRIDAL_ROW } from "./picks";

/** New arrivals: five new pieces at today's rate. */
export function NewArrivals() {
  const t = useT(home);
  return (
    <ProductRow
      id="new-title"
      title={t("newTitle")}
      intro={t("newIntro", { rate: formatINR(RATES.g22), pct: OFFER.gstPct })}
      link={{ href: routes.shop(), label: t("viewAll") }}
      products={NEW_ROW}
    />
  );
}

/** Temple and bridal: haarams, chokers, kemp sets and jhumkas. */
export function TempleBridal() {
  const t = useT(home);
  return <ProductRow id="tb-title" title={t("tbTitle")} intro={t("tbIntro")} link={{ href: routes.shop("temple"), label: t("viewAll") }} products={TEMPLE_BRIDAL_ROW} />;
}
