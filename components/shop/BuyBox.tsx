"use client";
import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/catalog";
import { formatINR, priceBreakdown, type PriceMode } from "@/lib/pricing";
import { OFFER } from "@/lib/site.config";
import { routes } from "@/lib/routes";
import { useDemo } from "@/lib/use-demo";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { shop } from "@/lib/i18n/dict/shop";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { ContactSheet } from "@/components/ui/ContactSheet";
import { PriceBreakdownTable } from "@/components/site/PriceBreakdownTable";

export interface BuyBoxProps {
  product: Product;
  /** Phone layout (the /app product screen): smaller name, tighter spacing, full-width stacked actions. */
  compact?: boolean;
  /** Where Buy now / Pre-book goes after adding to the cart. Default `routes.cart()`. */
  cartHref?: string;
}

/**
 * `<BuyBox product compact? cartHref?>`: name, purity and weight, the BIS 916 badge for 22K, the Buy / Pre-book
 * choice (Pre-book only when `prebookable`), size when the piece has `sizes`, today's price and the live
 * breakdown table. Buy now / Pre-book dispatches `addToCart` (qty 1) and goes to the cart; Ask on WhatsApp opens
 * ContactSheet (the coin desk for gold coins). Self-contained: owns its mode, size and sheet state.
 */
export function BuyBox({ product: p, compact = false, cartHref = routes.cart() }: BuyBoxProps) {
  const t = useT(shop);
  const tc = useT(common);
  const l = useL10n();
  const router = useRouter();
  const { dispatch } = useDemo();
  const [mode, setMode] = useState<PriceMode>("buy");
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [contact, setContact] = useState(false);
  const sizeRef = useRef<HTMLSelectElement>(null);
  const ids = { mode: useId(), size: useId(), sizeErr: useId() };

  const prebook = mode === "prebook" && p.prebookable;
  const b = priceBreakdown(p, prebook ? "prebook" : "buy");
  const regular = prebook ? priceBreakdown(p, "buy") : null;
  const purity = p.purity === "22K" ? tc("purity916") : p.purity === "silver" ? tc("rateSilver") : p.purity;
  const sizeLabel = p.category === "bangle" ? t("sizeBangle") : p.category === "ring" ? t("sizeRing") : t("sizeLabel");
  const Name = compact ? "h2" : "h1";

  const add = () => {
    if (p.sizes?.length && !size) {
      setSizeError(true);
      sizeRef.current?.focus();
      return;
    }
    dispatch({ type: "addToCart", line: { slug: p.slug, mode: prebook ? "prebook" : "buy", size: size || undefined, qty: 1 } });
    router.push(cartHref);
  };

  return (
    <div className={compact ? "" : "lg:max-w-[34rem]"}>
      <Name
        className={`font-display font-semibold leading-[1.1] text-ink [html[lang=ta]_&]:font-sans [html[lang=ta]_&]:leading-snug ${
          compact ? "text-[1.9rem] [html[lang=ta]_&]:text-[22px]" : "text-[2.4rem] sm:text-[2.9rem] [html[lang=ta]_&]:text-[26px] sm:[html[lang=ta]_&]:text-[32px]"
        }`}
      >
        {l(p.name)}
      </Name>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-[15px] text-mute">{purity}, {tc("weightG", { g: p.weightG })}</p>
        {p.purity === "22K" && <HallmarkBadge label={t("hallmarkBadge")} />}
        {p.isNew && <span className="rounded-[3px] bg-maroon px-2 py-[3px] text-[11.5px] font-semibold leading-none text-white">{tc("newArrival")}</span>}
      </div>

      {p.prebookable && (
        <fieldset className={compact ? "mt-5" : "mt-7"}>
          <legend id={ids.mode} className="mb-2.5 text-[15px] font-semibold text-ink">{t("modeLabel")}</legend>
          <div className="grid grid-cols-2 gap-2.5">
            <ModeOption name={ids.mode} checked={!prebook} onSelect={() => setMode("buy")} title={t("modeBuy")} hint={t("modeBuyHint")} />
            <ModeOption
              name={ids.mode}
              checked={prebook}
              onSelect={() => setMode("prebook")}
              title={t("modePrebook")}
              hint={t("modePrebookHint", { off: OFFER.prebookOffPerGram })}
            />
          </div>
        </fieldset>
      )}

      <div className={compact ? "mt-5" : "mt-7"} aria-live="polite">
        <p className="text-[14px] text-mute">{prebook ? t("prebookTotalLabel") : t("totalLabel")}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Price value={b.total} size={compact ? "lg" : "xl"} className="text-maroon" />
          {regular && <Price value={regular.total} size="md" strike className="text-mute" />}
          <span className="text-[13px] text-mute">{tc("priceInclGst")}</span>
        </div>
        {prebook && (
          <p className="mt-3 max-w-[52ch] rounded-[4px] bg-cream px-3.5 py-2.5 text-[14px] leading-snug text-ink">{t("payTodayLine", { amount: formatINR(b.advance) })}</p>
        )}
      </div>

      {p.sizes?.length ? (
        <div className="mt-5">
          <label htmlFor={ids.size} className="mb-2 block text-[15px] font-semibold text-ink">{sizeLabel}</label>
          <div className="relative max-w-60">
            <select
              ref={sizeRef}
              id={ids.size}
              value={size}
              aria-invalid={sizeError || undefined}
              aria-describedby={sizeError ? ids.sizeErr : undefined}
              onChange={(e) => { setSize(e.target.value); setSizeError(false); }}
              className={`min-h-11 w-full appearance-none rounded-[4px] border bg-white py-2 pl-3.5 pr-10 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                sizeError ? "border-maroon ring-1 ring-maroon" : "border-line hover:border-maroon/50"
              }`}
            >
              <option value="" disabled>{t("sizeChoose")}</option>
              {p.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute right-3.5 top-1/2 size-3 -translate-y-1/2 text-maroon">
              <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </div>
          {sizeError && <p id={ids.sizeErr} className="mt-1.5 text-[14px] font-medium text-maroon">{t("sizeNeeded")}</p>}
        </div>
      ) : null}

      <div className={`mt-6 flex gap-3 ${compact ? "flex-col" : "flex-col sm:flex-row sm:flex-wrap"}`}>
        <Button variant="maroon" size="lg" onClick={add} className={compact ? "w-full" : "sm:min-w-56"}>
          {prebook ? t("ctaPrebook", { pct: OFFER.prebookAdvancePct, amount: formatINR(b.advance) }) : t("ctaBuy")}
        </Button>
        <Button variant="ghost" size="lg" onClick={() => setContact(true)} className={compact ? "w-full" : ""} aria-haspopup="dialog">
          {t("ctaWhatsApp")}
        </Button>
      </div>
      <p className="mt-3 max-w-[52ch] text-[13.5px] leading-snug text-mute">{t("collectNote")}</p>

      <PriceBreakdownTable breakdown={b} mode={prebook ? "prebook" : "buy"} purity={p.purity} className={compact ? "mt-7" : "mt-9"} />

      <ContactSheet open={contact} onClose={() => setContact(false)} topic={p.category === "coin" ? "goldCoins" : "general"} />
    </div>
  );
}

/** A v2 radio card: a drawn radio dot, the choice in semibold ink and a grey hint. Checked: maroon border and dot. */
function ModeOption({ name, checked, onSelect, title, hint }: { name: string; checked: boolean; onSelect: () => void; title: string; hint: string }) {
  return (
    <label
      className={`relative flex cursor-pointer items-start gap-2.5 rounded-[6px] border bg-white px-3.5 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold sm:gap-3 sm:px-4 sm:py-3.5 ${
        checked ? "border-maroon ring-1 ring-maroon" : "border-line hover:border-maroon/50"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      <span aria-hidden className={`mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px] ${checked ? "border-maroon" : "border-[#b9b0a8]"}`}>
        {checked && <span className="size-2.5 rounded-full bg-maroon" />}
      </span>
      <span className="min-w-0">
        <span className="block text-[16px] font-semibold leading-tight text-ink">{title}</span>
        <span className="mt-1 block text-[13px] leading-snug text-mute">{hint}</span>
      </span>
    </label>
  );
}

/** BIS 916: a small tag with a gold hairline and ink text (never gold text on white). The BIS logo itself is not drawn. */
function HallmarkBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[3px] border border-gold/60 px-2 py-[3px] text-[12px] font-semibold leading-none text-ink">{label}</span>
  );
}
