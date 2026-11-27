"use client";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { useL10n, useT } from "@/lib/i18n";
import { home } from "@/lib/i18n/dict/home";
import { ProductImage } from "@/components/ui/ProductImage";
import { SectionHead } from "./SectionHead";
import { CATEGORY_COVERS } from "./picks";

/** Shop by category: a row of round photo thumbnails, one piece per category, label under each. Scrolls sideways on phones. */
export function CategoryBar() {
  const t = useT(home);
  const l = useL10n();
  return (
    <section aria-labelledby="cat-title" className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8">
      <SectionHead id="cat-title" title={t("catTitle")} link={{ href: routes.shop(), label: t("catAll") }} />
      <ul className="no-scrollbar -mx-4 mt-6 flex gap-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-10 lg:gap-4 lg:overflow-visible lg:px-0">
        {CATEGORY_COVERS.map((c) => (
          <li key={c.id} className="w-[84px] shrink-0 sm:w-[100px] lg:w-auto">
            <Link href={routes.shop(c.id)} className="group block rounded-sm text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
              <span className="block overflow-hidden rounded-full border border-line transition-colors group-hover:border-maroon/50">
                <ProductImage src={c.product?.image ?? ""} alt="" kind={c.id} zoom className="aspect-square w-full" />
              </span>
              <span className="mt-2.5 block text-[13.5px] font-medium leading-snug text-ink group-hover:text-maroon sm:text-[14.5px]">{l(c)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
