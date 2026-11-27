"use client";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { asset } from "@/lib/asset";
import { OFFER } from "@/lib/site.config";
import { useL10n, useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { shop } from "@/lib/i18n/dict/shop";
import { ProductImage } from "@/components/ui/ProductImage";
import { hasImage } from "@/lib/images";

/** Full piece, then three close-ups cut from the same photo with object-position (and a scale to zoom). */
const VIEWS: { pos: string; zoom: number }[] = [
  { pos: "50% 50%", zoom: 1 },
  { pos: "50% 28%", zoom: 2.1 },
  { pos: "28% 62%", zoom: 2.4 },
  { pos: "72% 70%", zoom: 2.4 },
];

/**
 * `<ProductGallery product>`. With a photo (in lib/image-manifest.ts, or `available`): the main view in the arch niche and
 * three zoom-crops as thumbnails. Without a photo it does not fake thumbnails: one niche with the gold sketch,
 * then the piece's purity, counter-scale weight and 0% wastage, the way the tag reads at the counter.
 */
export function ProductGallery({ product: p, available = hasImage(p.image), className = "" }: { product: Product; available?: boolean; className?: string }) {
  const t = useT(shop);
  const l = useL10n();
  const [view, setView] = useState(0);
  const [failed, setFailed] = useState(false);
  const name = l(p.name);

  if (!available || failed) {
    return (
      <div className={className}>
        <ProductImage src={p.image} alt={name} kind={p.category} available={false} className="aspect-square w-full sm:aspect-[4/3] lg:aspect-[4/5]" />
        <p className="mt-2 text-[13px] text-ink/50">{t("photoSoon")}</p>
        <PieceDetails product={p} />
      </div>
    );
  }

  return (
    <div className={className}>
      <Niche>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(p.image)}
          alt={name}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover transition-transform duration-300 motion-reduce:transition-none"
          style={{ objectPosition: VIEWS[view].pos, transform: `scale(${VIEWS[view].zoom})`, transformOrigin: VIEWS[view].pos }}
        />
      </Niche>
      <div className="mt-3 grid grid-cols-4 gap-2.5" role="group" aria-label={name}>
        {VIEWS.map((v, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={view === i}
            aria-label={`${name} ${i + 1}/${VIEWS.length}`}
            onClick={() => setView(i)}
            className={`relative aspect-square overflow-hidden rounded-t-full border bg-maroon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
              view === i ? "border-gold" : "border-gold/30 hover:border-gold/70"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(p.image)}
              alt=""
              loading="lazy"
              onError={() => setFailed(true)}
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: v.pos, transform: `scale(${v.zoom})`, transformOrigin: v.pos }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/** The same arch niche as ProductImage, for a photo we crop and zoom ourselves. */
function Niche({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate aspect-[4/5] w-full overflow-hidden bg-maroon">
      <div className="absolute inset-x-[9%] bottom-[6%] top-[7%] overflow-hidden rounded-t-[999px] bg-maroon-deep">{children}</div>
      <div aria-hidden className="pointer-events-none absolute inset-x-[9%] bottom-[6%] top-[7%] rounded-t-[999px] border border-gold/80" />
      <div aria-hidden className="pointer-events-none absolute inset-x-[calc(9%+5px)] bottom-[calc(6%+5px)] top-[calc(7%+5px)] rounded-t-[999px] border border-gold/35" />
    </div>
  );
}

/** Purity, weight to three decimals (as the counter scale reads) and wastage, in three ruled cells. */
function PieceDetails({ product: p }: { product: Product }) {
  const t = useT(shop);
  const tc = useT(common);
  const puritySub =
    p.purity === "22K" ? t("detPurity22") : p.purity === "24K" ? t("detPurity24") : p.purity === "18K" ? t("detPurity18") : t("detPuritySilver");
  const cells = [
    { label: t("detPurity"), value: p.purity === "silver" ? tc("rateSilver") : p.purity, sub: puritySub },
    { label: t("detWeight"), value: tc("weightG", { g: p.weightG.toFixed(3) }), sub: t("detWeightSub") },
    { label: t("detWastage"), value: `${OFFER.wastagePct}%`, sub: t("detWastageSub") },
  ];
  return (
    <section aria-label={t("detailsTitle")} className="mt-5">
      <dl className="grid grid-cols-3 border-y border-gold/45">
        {cells.map((c, i) => (
          <div key={c.label} className={`py-4 ${i > 0 ? "border-l border-gold/30 pl-3 sm:pl-5" : "pr-3"}`}>
            <dt className="text-[12.5px] text-ink/60">{c.label}</dt>
            <dd className="mt-0.5 font-display text-[1.45rem] font-semibold leading-tight text-maroon num sm:text-[1.7rem]">{c.value}</dd>
            <dd className="mt-0.5 text-[12.5px] leading-snug text-ink/55">{c.sub}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
