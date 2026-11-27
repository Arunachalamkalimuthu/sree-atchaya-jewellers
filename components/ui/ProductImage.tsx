"use client";
import { useState } from "react";
import { asset } from "@/lib/asset";
import { hasImage } from "@/lib/images";
import type { CategoryId } from "@/lib/catalog";

interface Props {
  src: string;
  alt: string;
  /** Size the tile here, e.g. "aspect-square w-full". Photos are square (1200×1200) and fill it with object-cover. */
  className?: string;
  /** Force the photo on or off. Default: whether `src` is in lib/image-manifest.ts. */
  available?: boolean;
  /** The empty tile shows this kind's small line icon. */
  kind?: CategoryId;
  /** Zoom the photo slightly while an ancestor `.group` is hovered (product tiles). Off under reduced motion. */
  zoom?: boolean;
  /** Load straight away (first screen). Default lazy. */
  eager?: boolean;
  /** @deprecated v1 niche options; ignored. */
  label?: string;
  /** @deprecated v1 niche options; ignored. */
  tone?: "maroon" | "ivory";
  /** @deprecated v1 niche options; ignored. */
  arch?: boolean;
}

/**
 * `<ProductImage src alt className kind? zoom?>`: a plain photo tile. With a photo (listed in the image manifest), the
 * photo fills the box on white. Without one, a light-grey tile with the category's small grey line icon, never a
 * placeholder frame. Nothing is requested for a missing file, so there are no 404s.
 */
export function ProductImage({ src, alt, className = "", available, kind, zoom = false, eager = false }: Props) {
  const [failed, setFailed] = useState(false);
  const show = (available ?? hasImage(src)) && !failed;

  if (!show) {
    return (
      <div role="img" aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={`relative grid place-items-center overflow-hidden bg-tile ${className}`}>
        {kind && <CategorySketch kind={kind} className="w-[30%] max-w-20 text-[#b9b0a8]" />}
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(src)}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={`absolute inset-0 size-full object-cover ${zoom ? "transition-transform duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100" : ""}`}
      />
    </div>
  );
}

/** Line sketches, one per kind of piece (currentColor). The empty-tile icon, and the category bar's fallback. */
export function CategorySketch({ kind, className }: { kind: CategoryId; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const beads = (pts: [number, number][]) => pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} fill="currentColor" stroke="none" />);
  let body: React.ReactNode;
  switch (kind) {
    case "necklace":
      body = <><path d="M20 22c2 34 58 34 60 0" {...common} /><path d="M24 22c3 27 49 27 52 0" {...common} opacity={0.55} />{beads([[30, 41], [40, 46], [60, 46], [70, 41]])}<path d="M50 48l-5 7 5 9 5-9z" {...common} /><circle cx="50" cy="56" r="1.6" fill="currentColor" /></>;
      break;
    case "haaram":
      body = <><path d="M26 8c-2 58 50 58 48 0" {...common} /><path d="M31 8c-1 48 39 48 38 0" {...common} opacity={0.55} />{beads([[29, 30], [33, 44], [41, 54], [59, 54], [67, 44], [71, 30]])}<path d="M50 62l-6 8 6 12 6-12z" {...common} /><path d="M50 82v6" {...common} /><circle cx="50" cy="90" r="2" {...common} /></>;
      break;
    case "temple":
      body = <><path d="M20 18c2 36 58 36 60 0" {...common} />{[30, 38, 62, 70].map((x, i) => <path key={i} d={`M${x} ${i === 0 || i === 3 ? 38 : 45}l-2.5 3.5 2.5 3.5 2.5-3.5z`} {...common} />)}<circle cx="50" cy="58" r="9" {...common} /><circle cx="50" cy="58" r="5.5" {...common} opacity={0.6} /><path d="M50 52.5v3M47.5 58h5" {...common} /><path d="M44 67l6 6 6-6" {...common} /></>;
      break;
    case "bangle":
      body = <><ellipse cx="42" cy="54" rx="24" ry="24" {...common} /><ellipse cx="42" cy="54" rx="19" ry="19" {...common} opacity={0.55} /><ellipse cx="58" cy="50" rx="24" ry="24" {...common} /><ellipse cx="58" cy="50" rx="19" ry="19" {...common} opacity={0.55} /></>;
      break;
    case "chain":
      body = <><path d="M18 18c4 38 60 38 64 0" {...common} strokeDasharray="3 2.2" /><path d="M22 18c4 32 52 32 56 0" {...common} strokeDasharray="3 2.2" opacity={0.6} /><path d="M50 45v6" {...common} /><path d="M46 51h8l-2 6h-4z" {...common} /></>;
      break;
    case "earring":
      body = <>{[34, 66].map((x) => <g key={x}><path d={`M${x} 18c-5 0-5 7 0 8`} {...common} /><circle cx={x} cy={31} r={4} {...common} /><path d={`M${x - 12} 58q12-26 24 0z`} {...common} /><path d={`M${x - 12} 58h24`} {...common} />{beads([[x - 9, 63], [x - 3, 65], [x + 3, 65], [x + 9, 63]])}</g>)}</>;
      break;
    case "ring":
      body = <><circle cx="50" cy="58" r="22" {...common} /><circle cx="50" cy="58" r="18" {...common} opacity={0.55} /><path d="M42 36l4-8h8l4 8-8 6z" {...common} /><path d="M42 36h16M46 28l4 14 4-14" {...common} opacity={0.7} /></>;
      break;
    case "coin":
      body = <><circle cx="50" cy="50" r="28" {...common} /><circle cx="50" cy="50" r="23" {...common} opacity={0.55} /><path d="M50 36c4 6 6 9 6 12a6 6 0 01-12 0c0-3 2-6 6-12z" {...common} /><path d="M41 60c3 4 6 5 9 5s6-1 9-5" {...common} /></>;
      break;
    case "silver":
      body = <><path d="M50 12c3 5 4 7 4 9a4 4 0 01-8 0c0-2 1-4 4-9z" {...common} /><path d="M38 28h24l-4 6H42z" {...common} /><path d="M50 34v34" {...common} /><path d="M46 46h8M45 56h10" {...common} opacity={0.6} /><path d="M34 82c4-10 28-10 32 0z" {...common} /><path d="M30 86h40" {...common} /></>;
      break;
    case "diamond":
      body = <><path d="M28 40l12-14h20l12 14-22 34z" {...common} /><path d="M28 40h44M40 26l5 14 5 34M60 26l-5 14-5 34" {...common} opacity={0.65} /></>;
      break;
  }
  return <svg viewBox="0 0 100 100" className={className} aria-hidden="true">{body}</svg>;
}
