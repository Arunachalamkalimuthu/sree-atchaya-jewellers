import type { ReactNode } from "react";

export type OrnateTone = "maroon" | "emerald" | "plum";

const fields: Record<OrnateTone, string> = {
  maroon: "bg-maroon text-ivory",
  emerald: "bg-emerald text-ivory",
  plum: "bg-plum text-ivory",
};

/**
 * `<OrnateFrame tone="maroon"|"emerald"|"plum">`: the gold ornamental border from the shop's offer posters.
 * Offer moments only (today's offer, scheme call-out, contest, coin offer, sell gold). It means "this is a deal".
 * Plum is for contests.
 */
export function OrnateFrame({ tone = "maroon", className = "", children }: { tone?: OrnateTone; className?: string; children: ReactNode }) {
  return (
    <div className={`relative isolate ${fields[tone]} ${className}`} style={{ ["--corner-fill" as string]: `var(--${tone})` }}>
      <div aria-hidden className="pointer-events-none absolute inset-[10px] border border-gold/80" />
      <div aria-hidden className="pointer-events-none absolute inset-[15px] border border-gold/30" />
      <Corner className="left-0 top-0" />
      <Corner className="right-0 top-0 -scale-x-100" />
      <Corner className="bottom-0 left-0 -scale-y-100" />
      <Corner className="bottom-0 right-0 -scale-100" />
      <div className="relative px-7 py-8 sm:px-10 sm:py-10">{children}</div>
    </div>
  );
}

/** Corner motif drawn at the top-left; mirrored for the others. A lozenge over the line crossing, two curls along the edges. */
function Corner({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 44 44" className={`pointer-events-none absolute size-11 text-gold ${className}`} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      <path d="M10.5 3.5L17.5 10.5 10.5 17.5 3.5 10.5z" style={{ fill: "var(--corner-fill)" }} />
      <path d="M10.5 6.8L14.2 10.5 10.5 14.2 6.8 10.5z" fill="currentColor" stroke="none" />
      <path d="M19 10.5c3.5-4.2 8.5-4.2 11 0 1.4 2.4-.8 4.6-2.8 3.3" />
      <path d="M10.5 19c-4.2 3.5-4.2 8.5 0 11 2.4 1.4 4.6-.8 3.3-2.8" />
      <circle cx="35" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="35" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
