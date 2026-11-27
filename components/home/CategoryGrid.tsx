"use client";
import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { routes } from "@/lib/routes";
import { useL10n, useLang, useT } from "@/lib/i18n";
import { home } from "@/lib/i18n/dict/home";
import { ProductImage } from "@/components/ui/ProductImage";
import { SectionHead } from "./SectionHead";

/**
 * The ten jewellery kinds, each a pale niche with the jeweller's line sketch (ivory, so it reads apart from the
 * maroon product niches below). Phones: two rows that scroll sideways. From 768 px: five across, two rows.
 */
export function CategoryGrid() {
  const t = useT(home);
  const l = useL10n();
  const [lang] = useLang();
  // Tamil names in the serif run wider than the tile at 768 px (வளையல்கள்): set them in Mukta Malar instead.
  const face = lang === "ta" ? "font-sans text-[15px] sm:text-base" : "font-display text-[1.1rem] sm:text-[1.25rem]";
  return (
    <section aria-labelledby="cat-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <SectionHead id="cat-title" title={t("catTitle")} link={{ href: routes.shop(), label: t("catAll") }} />
      <ul className="-mx-4 mt-8 grid auto-cols-[42%] grid-flow-col grid-rows-2 gap-x-3 gap-y-6 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:auto-cols-[26%] sm:px-6 md:mx-0 md:grid-flow-row md:grid-cols-5 md:grid-rows-none md:gap-x-5 md:gap-y-9 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => (
          <li key={c.id} className="min-w-0">
            <Link href={routes.shop(c.id)} className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
              <ProductImage src="" alt="" available={false} kind={c.id} tone="ivory" className="aspect-[4/5] w-full" />
              <p className={`mt-2.5 px-1 text-center break-words font-semibold leading-snug text-maroon-deep decoration-gold decoration-1 underline-offset-4 group-hover:underline ${face}`}>
                {l(c)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
