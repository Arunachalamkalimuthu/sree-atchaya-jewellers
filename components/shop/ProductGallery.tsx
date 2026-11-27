"use client";
import { useState, type PointerEvent } from "react";
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
/** How far the main view magnifies under a mouse pointer. */
const HOVER_ZOOM = 2.2;

/**
 * `<ProductGallery product>`. With a photo (in lib/image-manifest.ts, or `available`): a large square view on white
 * and four bordered thumbnails (the full piece and three close-ups from the same photo). With a mouse, the main view
 * magnifies where the pointer is; touch and keyboard users get the close-ups from the thumbnails. Without a photo it
 * does not fake thumbnails: one light-grey tile with the category icon, then the purity, counter-scale weight and
 * 0% wastage, the way the tag reads at the counter.
 */
export function ProductGallery({ product: p, available = hasImage(p.image), className = "" }: { product: Product; available?: boolean; className?: string }) {
  const t = useT(shop);
  const l = useL10n();
  const [view, setView] = useState(0);
  const [failed, setFailed] = useState(false);
  const [lens, setLens] = useState<string | null>(null);
  const name = l(p.name);

  if (!available || failed) {
    return (
      <div className={className}>
        <ProductImage src={p.image} alt={name} kind={p.category} available={false} className="aspect-square w-full rounded-[6px] border border-line sm:aspect-[4/3] lg:aspect-square" />
        <p className="mt-2 text-[13px] text-mute">{t("photoSoon")}</p>
        <PieceDetails product={p} />
      </div>
    );
  }

  const v = VIEWS[view];
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
    setLens(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  };

  return (
    <div className={className}>
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-[6px] border border-line bg-white ${lens ? "cursor-zoom-in" : ""}`}
        onPointerMove={onMove}
        onPointerLeave={() => setLens(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(p.image)}
          alt={name}
          fetchPriority="high"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={
            lens
              ? { objectPosition: "50% 50%", transform: `scale(${HOVER_ZOOM})`, transformOrigin: lens }
              : { objectPosition: v.pos, transform: `scale(${v.zoom})`, transformOrigin: v.pos }
          }
        />
      </div>
      <div className="mt-3 flex gap-2.5" role="group" aria-label={name}>
        {VIEWS.map((x, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={view === i}
            aria-label={`${name} ${i + 1}/${VIEWS.length}`}
            onClick={() => setView(i)}
            className={`relative size-[68px] shrink-0 overflow-hidden rounded-[4px] border bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:size-20 ${
              view === i ? "border-maroon ring-1 ring-maroon" : "border-line hover:border-maroon/50"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(p.image)}
              alt=""
              loading="lazy"
              onError={() => setFailed(true)}
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: x.pos, transform: `scale(${x.zoom})`, transformOrigin: x.pos }}
            />
          </button>
        ))}
      </div>
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
      <dl className="grid grid-cols-3 rounded-[6px] border border-line">
        {cells.map((c, i) => (
          <div key={c.label} className={`px-3 py-4 sm:px-5 ${i > 0 ? "border-l border-line" : ""}`}>
            <dt className="text-[12.5px] text-mute">{c.label}</dt>
            <dd className="mt-0.5 text-[18px] font-semibold leading-tight text-ink sm:text-[20px]">{c.value}</dd>
            <dd className="mt-0.5 text-[12.5px] leading-snug text-mute">{c.sub}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
