"use client";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";

/**
 * The gold mark: a temple niche (the arch of a shrine) holding a lit deepam, for "Atchaya" (the undying).
 * Drawn for this preview; it is not the shop's logo, which replaces it when they send the file.
 */
export function Mark({ size = 32, className = "", title }: { size?: number; className?: string; title?: string }) {
  return (
    <svg
      width={size * 0.8} height={size} viewBox="0 0 32 40" fill="none" className={className}
      role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}
    >
      <circle cx="16" cy="2.6" r="1.6" fill="currentColor" />
      <path d="M3.5 38.5V16a12.5 12.5 0 0125 0v22.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 38.5V16.5a9 9 0 0118 0v22" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
      <path d="M16 13.2c2.6 3.6 3.8 6.2 3.8 8.1a3.8 3.8 0 01-7.6 0c0-1.9 1.2-4.5 3.8-8.1z" fill="currentColor" />
      <path d="M10.5 27.2c1.2 2.3 3.2 3.4 5.5 3.4s4.3-1.1 5.5-3.4z" fill="currentColor" opacity="0.9" />
      <path d="M13.2 33.5h5.6M14.6 30.8v2.7M17.4 30.8v2.7" stroke="currentColor" strokeWidth="1" />
      <path d="M1.5 38.5h29" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

type Size = "sm" | "md" | "lg";
const sizes: Record<Size, { mark: number; name: string; sub: string; gap: string }> = {
  sm: { mark: 26, name: "text-[1.3rem]", sub: "text-[0.72rem]", gap: "gap-2" },
  md: { mark: 34, name: "text-[1.65rem]", sub: "text-[0.8rem]", gap: "gap-2.5" },
  lg: { mark: 52, name: "text-[2.6rem]", sub: "text-base", gap: "gap-3.5" },
};

/** Typographic wordmark. `tone="ivory"` on dark (maroon) grounds, `"maroon"` on ivory. */
export function Wordmark({ tone = "maroon", size = "md", className = "" }: { tone?: "maroon" | "ivory"; size?: Size; className?: string }) {
  const t = useT(common);
  const s = sizes[size];
  const nameColour = tone === "ivory" ? "text-ivory" : "text-maroon";
  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <Mark size={s.mark} className="shrink-0 text-gold" />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold tracking-[0.01em] whitespace-nowrap ${s.name} ${nameColour}`}>{t("brandName")}</span>
        <span className={`mt-1 flex items-center gap-1.5 font-display italic text-gold ${s.sub}`}>
          <span aria-hidden className="h-px w-3 bg-gold/60" />
          <span className="whitespace-nowrap">{t("brandSub")}</span>
          <span aria-hidden className="h-px flex-1 min-w-3 bg-gold/60" />
        </span>
      </span>
    </span>
  );
}
