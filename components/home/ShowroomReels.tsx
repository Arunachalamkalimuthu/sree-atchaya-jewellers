"use client";
import { useState } from "react";
import type { CategoryId } from "@/lib/catalog";
import { SITE } from "@/lib/site.config";
import { useLang, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { home } from "@/lib/i18n/dict/home";
import { ProductImage } from "@/components/ui/ProductImage";
import { Sheet } from "@/components/ui/Sheet";
import { Icon } from "@/components/ui/Icon";
import { SectionHead } from "./SectionHead";

type ReelKey = "rl1" | "rl2" | "rl3" | "rl4";
const REELS: { key: ReelKey; kind: CategoryId }[] = [
  { key: "rl1", kind: "necklace" },
  { key: "rl2", kind: "coin" },
  { key: "rl3", kind: "temple" },
  { key: "rl4", kind: "haaram" },
];

/**
 * "From our showroom": four tall arch tiles named after the shop's own reels. Like their posters, each carries the
 * title in both languages (current language first). A tap opens a text-only "Watch on Instagram" sheet; no link.
 */
export function ShowroomReels() {
  const t = useT(home);
  const c = useT(common);
  const [lang] = useLang();
  const other = lang === "en" ? "ta" : "en";
  const [open, setOpen] = useState<ReelKey | null>(null);

  return (
    <section aria-labelledby="reels-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <SectionHead id="reels-title" title={t("rlTitle")} intro={t("rlIntro", { handle: SITE.instagram })} />
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {REELS.map((r) => (
          <li key={r.key}>
            <button
              type="button"
              onClick={() => setOpen(r.key)}
              aria-haspopup="dialog"
              aria-label={t("rlPlay", { title: t(r.key) })}
              className="group relative block w-full rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span className="relative block">
                <ProductImage src="" alt="" available={false} kind={r.kind} className="aspect-[9/16] w-full" />
                <span className="pointer-events-none absolute inset-x-0 bottom-[11%] flex justify-center lg:bottom-[33%]">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-gold-light/85">
                    <svg width="10" height="11" viewBox="0 0 10 11" aria-hidden="true"><path d="M1 .8v9.4l8-4.7z" fill="currentColor" /></svg>
                    {t("rlReel")}
                  </span>
                </span>
              </span>
              {/* Phones: title under the tile. Desktop: inside the niche, like their posters. */}
              <span className="pointer-events-none mt-2.5 flex flex-col items-center text-center lg:absolute lg:inset-x-[9%] lg:bottom-[6%] lg:mt-0 lg:px-3 lg:pb-[12%]">
                <span className="font-display text-[1.15rem] font-semibold leading-tight text-maroon-deep lg:text-[1.45rem] lg:text-ivory">{t(r.key)}</span>
                <span className="mt-0.5 font-display text-[0.95rem] leading-snug text-ink/60 lg:mt-1 lg:text-[1.05rem] lg:text-gold-light/80">{home[other][r.key]}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Sheet open={open !== null} onClose={() => setOpen(null)} title={t("rlSheetTitle")} width="sm">
        {open && <p className="font-display text-[1.3rem] font-semibold text-maroon">{t(open)}</p>}
        <p className="mt-2 text-[15px] leading-relaxed text-maroon-deep/80">{t("rlSheetBody")}</p>
        <p className="mt-4 flex items-center gap-2 border-y border-gold/30 py-3 text-[17px] text-maroon-deep">
          <Icon name="instagram" size={20} className="text-gold" />
          <span className="select-all font-semibold">@{SITE.instagram}</span>
        </p>
        <div role="note" className="mt-5 rounded-[4px] border border-dashed border-maroon/30 bg-maroon/[0.04] px-4 py-3">
          <p className="text-sm font-semibold text-maroon">{c("contactDemo")}</p>
          <p className="mt-1 text-[13px] leading-snug text-maroon-deep/70">{t("rlSheetDemo")}</p>
        </div>
      </Sheet>
    </section>
  );
}
