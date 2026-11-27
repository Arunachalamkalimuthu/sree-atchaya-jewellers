"use client";
import { useState } from "react";
import { asset } from "@/lib/asset";
import type { CategoryId } from "@/lib/catalog";
import { Mark } from "@/components/brand/Wordmark";

/**
 * Photos are not made yet (Canva on cooldown). While this is false, ProductImage never requests the file
 * (no 404 storm) and draws the showroom-niche placeholder. When photos land in /public/images, flip it to
 * true: every ProductImage then loads its `src` once and falls back to the placeholder only on error.
 * A single instance can opt in early with `available`.
 */
export const IMAGES_READY = false;

interface Props {
  src: string;
  alt: string;
  /** Size the box here (e.g. "aspect-[4/5] w-full"). The niche fills it. */
  className?: string;
  /** Override IMAGES_READY for this image. */
  available?: boolean;
  /** Placeholder draws a gold line sketch of this kind of piece instead of the plain mark. */
  kind?: CategoryId;
  /** Placeholder caption in the display serif (use where no caption sits under the image). */
  label?: string;
  /** "maroon" velvet (default) or "ivory" for light bands. */
  tone?: "maroon" | "ivory";
  /** Draw the arch niche. Turn off for full-bleed banners. Default true. */
  arch?: boolean;
}

// A faint velvet nap: fractal noise, tinted, at low opacity. A texture, not a gradient wash.
const VELVET =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * `<ProductImage src alt className>`: the jewel sits in an arch-topped niche, as on the showroom walls.
 * Placeholder: maroon velvet field, the niche in a fine double gold line, a gold sketch or mark inside.
 */
export function ProductImage({ src, alt, className = "", available = IMAGES_READY, kind, label, tone = "maroon", arch = true }: Props) {
  const [failed, setFailed] = useState(false);
  const showPhoto = available && !failed;
  const dark = tone === "maroon";

  return (
    <div
      className={`@container relative isolate overflow-hidden ${dark ? "bg-maroon" : "bg-[#f3e9d6]"} ${className}`}
      style={{ backgroundImage: `${dark ? `${VELVET}, ` : ""}radial-gradient(120% 80% at 50% 30%, ${dark ? "#7c1d20, #4a0d0f" : "#fbf3e4, #efe0c4"})` }}
    >
      <div
        className={`absolute inset-x-[9%] top-[7%] bottom-[6%] overflow-hidden ${arch ? "rounded-t-[999px]" : ""} ${
          dark ? "bg-maroon-deep/55 shadow-[inset_0_10px_24px_rgba(0,0,0,.35)]" : "bg-white/45 shadow-[inset_0_8px_20px_rgba(110,21,23,.08)]"
        }`}
      >
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(src)} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />
        ) : (
          <div role="img" aria-label={alt} className="absolute inset-0 flex flex-col items-center justify-center px-[10%] text-center">
            {kind ? <Sketch kind={kind} className="w-[72%] max-w-60 text-gold" /> : <Mark size={40} className="w-[16%] max-w-12 text-gold" />}
            {label && (
              <span className={`mt-[6%] font-display text-[clamp(13px,8cqw,26px)] font-medium leading-tight ${dark ? "text-gold-light" : "text-maroon"}`}>{label}</span>
            )}
          </div>
        )}
      </div>
      {/* The niche's double gold line sits above the photo so photos are framed the same way. */}
      <div aria-hidden className={`pointer-events-none absolute inset-x-[9%] top-[7%] bottom-[6%] border border-gold/80 ${arch ? "rounded-t-[999px]" : ""}`} />
      <div aria-hidden className={`pointer-events-none absolute inset-x-[calc(9%+5px)] top-[calc(7%+5px)] bottom-[calc(6%+5px)] border border-gold/35 ${arch ? "rounded-t-[999px]" : ""}`} />
    </div>
  );
}

/** Gold line sketches, one per kind of piece, like a jeweller's order-book drawing. */
function Sketch({ kind, className }: { kind: CategoryId; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
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
