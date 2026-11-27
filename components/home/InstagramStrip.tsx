"use client";
import { useState } from "react";
import { SITE } from "@/lib/site.config";
import { useL10n, useT } from "@/lib/i18n";
import { home } from "@/lib/i18n/dict/home";
import { ProductImage } from "@/components/ui/ProductImage";
import { Sheet } from "@/components/ui/Sheet";
import { Icon } from "@/components/ui/Icon";
import { SectionHead } from "./SectionHead";
import { INSTAGRAM_PICKS } from "./picks";

/**
 * "From our showroom": six square product photos and the Instagram handle as text. One even row of six from 1024 px;
 * a sideways scroll row on phones and tablets. A tap opens a text-only sheet (no link).
 */
export function InstagramStrip() {
  const t = useT(home);
  const l = useL10n();
  const [open, setOpen] = useState(false);
  return (
    <section aria-labelledby="ig-title" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <SectionHead id="ig-title" title={t("igTitle")} intro={t("igBody", { handle: SITE.instagram })} />
      <ul className="no-scrollbar -mx-4 mt-6 grid auto-cols-[calc((100%-3rem)/2.4)] grid-flow-col gap-x-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:auto-cols-[calc((100%-5rem)/3.4)] sm:gap-x-3 sm:px-6 lg:mx-0 lg:grid-flow-row lg:grid-cols-6 lg:gap-x-3 lg:overflow-visible lg:px-0">
        {INSTAGRAM_PICKS.map((p) => (
          <li key={p.slug} className="min-w-0">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-label={t("igTile", { name: l(p.name) })}
              className="group relative block w-full overflow-hidden rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <ProductImage src={p.image} alt="" kind={p.category} zoom className="aspect-square w-full" />
              <span aria-hidden className="absolute right-2 top-2 text-white opacity-0 [filter:drop-shadow(0_0_3px_rgba(0,0,0,.5))] transition-opacity group-hover:opacity-100">
                <Icon name="instagram" size={18} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Sheet open={open} onClose={() => setOpen(false)} title={t("igSheetTitle")} width="sm">
        <p className="text-[15px] leading-relaxed text-mute">{t("igSheetBody")}</p>
        <p className="mt-4 flex items-center gap-2 border-y border-line py-3 text-[17px] text-ink">
          <Icon name="instagram" size={20} className="text-maroon" />
          <span className="select-all font-semibold">@{SITE.instagram}</span>
        </p>
        <p className="mt-4 text-[13.5px] text-mute">{t("igSheetDemo")}</p>
      </Sheet>
    </section>
  );
}
