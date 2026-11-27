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
      <Name className={`font-display font-semibold leading-[1.1] text-maroon-deep ${compact ? "text-[1.75rem]" : "text-[2.2rem] sm:text-[2.75rem]"}`}>
        {l(p.name)}
      </Name>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-[15px] text-ink/70">{purity}, {tc("weightG", { g: p.weightG })}</p>
        {p.purity === "22K" && <HallmarkBadge label={t("hallmarkBadge")} />}
        {p.isNew && <span className="font-display text-[15px] italic text-maroon">{tc("newArrival")}</span>}
      </div>

      {p.prebookable && (
        <fieldset className={compact ? "mt-5" : "mt-7"}>
          <legend id={ids.mode} className="mb-2.5 text-[14px] text-ink/70">{t("modeLabel")}</legend>
          <div className="grid grid-cols-2 gap-2">
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

      <div className={`border-b border-gold/40 pb-5 ${compact ? "mt-5" : "mt-7"}`} aria-live="polite">
        <p className="text-[14px] text-ink/65">{prebook ? t("prebookTotalLabel") : t("totalLabel")}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
          <Price value={b.total} size="xl" className={`text-maroon ${compact ? "text-[2.3rem]!" : ""}`} />
          {regular && <Price value={regular.total} size="md" strike className="text-ink" />}
          <span className="text-[13px] text-ink/55">{tc("priceInclGst")}</span>
        </div>
        {prebook && (
          <p className="mt-2 max-w-[48ch] text-[14.5px] leading-snug text-emerald num">{t("payTodayLine", { amount: formatINR(b.advance) })}</p>
        )}
      </div>

      {p.sizes?.length ? (
        <div className="mt-5">
          <label htmlFor={ids.size} className="mb-2 block text-[14px] text-ink/70">{sizeLabel}</label>
          <div className="relative max-w-60">
            <select
              ref={sizeRef}
              id={ids.size}
              value={size}
              aria-invalid={sizeError || undefined}
              aria-describedby={sizeError ? ids.sizeErr : undefined}
              onChange={(e) => { setSize(e.target.value); setSizeError(false); }}
              className={`min-h-11 w-full appearance-none rounded-[3px] border bg-white/60 py-2 pl-3.5 pr-10 text-[15px] text-maroon-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                sizeError ? "border-maroon" : "border-maroon/30 hover:border-gold"
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
          {prebook ? t("ctaPrebook", { amount: formatINR(b.advance) }) : t("ctaBuy")}
        </Button>
        <Button variant="ghost" size="lg" onClick={() => setContact(true)} className={compact ? "w-full" : ""} aria-haspopup="dialog">
          {t("ctaWhatsApp")}
        </Button>
      </div>
      <p className="mt-3 max-w-[52ch] text-[13.5px] leading-snug text-ink/60">{t("collectNote")}</p>

      <PriceBreakdownTable breakdown={b} mode={prebook ? "prebook" : "buy"} purity={p.purity} className={compact ? "mt-7" : "mt-9"} />

      <ContactSheet open={contact} onClose={() => setContact(false)} topic={p.category === "coin" ? "goldCoins" : "general"} />
    </div>
  );
}

function ModeOption({ name, checked, onSelect, title, hint }: { name: string; checked: boolean; onSelect: () => void; title: string; hint: string }) {
  return (
    <label
      className={`relative flex cursor-pointer flex-col rounded-[3px] border px-3.5 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
        checked ? "border-maroon bg-maroon text-ivory" : "border-maroon/25 text-maroon-deep hover:border-gold"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      <span className="font-display text-[1.2rem] font-semibold leading-tight">{title}</span>
      <span className={`mt-0.5 text-[13px] leading-snug ${checked ? "text-gold-light" : "text-ink/60"}`}>{hint}</span>
    </label>
  );
}

/** A struck-metal look: fine double gold rule around the words. Text only; the BIS logo itself is not drawn. */
function HallmarkBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-gold p-[2px]">
      <span className="border border-gold/50 px-2 py-[1px] text-[12.5px] font-semibold leading-tight text-maroon">{label}</span>
    </span>
  );
}
