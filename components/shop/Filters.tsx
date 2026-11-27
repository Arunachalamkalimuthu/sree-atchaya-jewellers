"use client";
import { useId, useState } from "react";
import type { Product, Purity } from "@/lib/catalog";
import { useT } from "@/lib/i18n";
import { shop } from "@/lib/i18n/dict/shop";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { BANDS, PURITIES, SORTS, bandOf, type Band, type ShopQuery, type Sort } from "./query";

type T = ReturnType<typeof useT<typeof shop>>;

const purityKey = { "22K": "purity22", "24K": "purity24", "18K": "purity18", silver: "puritySilver" } as const;
const bandKey = { light: "bandLight", mid: "bandMid", heavy: "bandHeavy" } as const;
const sortKey = { new: "sortNew", price: "sortPriceAsc", "price-desc": "sortPriceDesc", weight: "sortWeightAsc" } as const;

interface FiltersProps {
  query: ShopQuery;
  onChange: (q: ShopQuery) => void;
  /** The pieces in the current category, before purity and weight filters (drives the options and counts). */
  base: Product[];
  /** How many pieces the current filters show. */
  resultCount: number;
}

/**
 * `<Filters query onChange base resultCount>`: purity, weight band and sort for the catalogue.
 * Desktop shows the chip rows inline; phones get a Filter button that opens a sheet, with Sort kept inline.
 * Options with no pieces are hidden; the purity row is hidden when the category has one purity.
 */
export function Filters({ query, onChange, base, resultCount }: FiltersProps) {
  const t = useT(shop);
  const [open, setOpen] = useState(false);
  const active = Number(!!query.purity) + Number(!!query.band);

  const set = (patch: Partial<ShopQuery>) => onChange({ ...query, ...patch });
  const clear = () => onChange({ cat: query.cat, sort: query.sort });

  const groups = <FilterGroups t={t} query={query} base={base} set={set} />;

  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
      <div className="hidden flex-wrap items-end gap-x-8 gap-y-4 md:flex">{groups}</div>

      <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <FilterGlyph />
        {active ? t("filtersButtonCount", { n: active }) : t("filtersButton")}
      </Button>

      <SortSelect t={t} value={query.sort} onChange={(sort) => set({ sort })} />

      {active > 0 && (
        <button
          type="button"
          onClick={clear}
          className="hidden min-h-9 rounded-sm text-[14px] text-maroon underline decoration-gold underline-offset-4 hover:text-maroon-deep focus-visible:outline-2 focus-visible:outline-gold md:block"
        >
          {t("clearFilters")}
        </button>
      )}

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={t("filtersTitle")}
        footer={
          <div className="flex items-center gap-3">
            {active > 0 && (
              <Button variant="ghost" onClick={clear}>{t("clearFilters")}</Button>
            )}
            <Button variant="maroon" full className="flex-1" onClick={() => setOpen(false)}>
              {t("showPieces", { n: resultCount })}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">{groups}</div>
      </Sheet>
    </div>
  );
}

function FilterGroups({ t, query, base, set }: { t: T; query: ShopQuery; base: Product[]; set: (p: Partial<ShopQuery>) => void }) {
  // Each row's counts respect the other row's choice, so a chip never leads to an empty grid.
  const byBand = query.band ? base.filter((p) => bandOf(p.weightG) === query.band) : base;
  const byPurity = query.purity ? base.filter((p) => p.purity === query.purity) : base;
  const purities = PURITIES.filter((x) => x === query.purity || byBand.some((p) => p.purity === x));
  const bands = BANDS.filter((b) => b === query.band || byPurity.some((p) => bandOf(p.weightG) === b));
  const showPurity = new Set(base.map((p) => p.purity)).size > 1;

  return (
    <>
      {showPurity && (
        <ChipRow<Purity>
          label={t("filterPurity")}
          anyLabel={t("filterAny")}
          value={query.purity}
          options={purities.map((x) => ({ value: x, label: t(purityKey[x]), count: byBand.filter((p) => p.purity === x).length }))}
          onChange={(purity) => set({ purity })}
        />
      )}
      <ChipRow<Band>
        label={t("filterWeight")}
        anyLabel={t("filterAny")}
        value={query.band}
        options={bands.map((b) => ({ value: b, label: t(bandKey[b]), count: byPurity.filter((p) => bandOf(p.weightG) === b).length }))}
        onChange={(band) => set({ band })}
      />
    </>
  );
}

function ChipRow<V extends string>({
  label, anyLabel, value, options, onChange,
}: { label: string; anyLabel: string; value?: V; options: { value: V; label: string; count: number }[]; onChange: (v: V | undefined) => void }) {
  const id = useId();
  const all = [{ value: undefined, label: anyLabel, count: undefined }, ...options];
  return (
    <div role="group" aria-labelledby={id}>
      <p id={id} className="mb-2 text-[13px] text-ink/60">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {all.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value ?? "any"}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.value)}
              className={`min-h-9 rounded-[2px] border px-3 text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                on ? "border-maroon bg-maroon text-ivory" : "border-maroon/25 text-maroon-deep hover:border-gold hover:bg-gold/10"
              }`}
            >
              {o.label}
              {o.count !== undefined && <span className={`ml-1.5 text-[12px] num ${on ? "text-gold-light" : "text-ink/45"}`}>{o.count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SortSelect({ t, value, onChange }: { t: T; value: Sort; onChange: (s: Sort) => void }) {
  const id = useId();
  return (
    <div className="ml-auto">
      <label htmlFor={id} className="mb-2 hidden text-[13px] text-ink/60 md:block">{t("sortLabel")}</label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as Sort)}
          aria-label={t("sortLabel")}
          className="min-h-9 appearance-none rounded-[2px] border border-maroon/25 bg-transparent py-1 pl-3 pr-9 text-[14px] text-maroon-deep hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {SORTS.map((s) => <option key={s} value={s}>{t(sortKey[s])}</option>)}
        </select>
        <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-maroon">
          <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </div>
    </div>
  );
}

/** Three sliders, drawn to match the thin line icons. */
function FilterGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" opacity=".55" />
      <circle cx="7" cy="5.5" r="1.8" fill="var(--ivory)" />
      <circle cx="13" cy="10" r="1.8" fill="var(--ivory)" />
      <circle cx="9" cy="14.5" r="1.8" fill="var(--ivory)" />
    </svg>
  );
}
