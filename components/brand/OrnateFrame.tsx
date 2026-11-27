import type { ReactNode } from "react";

export type OrnateTone = "light" | "maroon" | "emerald" | "plum";

const fields: Record<OrnateTone, string> = {
  light: "border-line bg-white text-ink",
  maroon: "border-maroon bg-maroon text-ivory",
  emerald: "border-emerald bg-emerald text-ivory",
  plum: "border-plum bg-plum text-ivory",
};

/**
 * Retired in design v2. `<OrnateFrame tone?>` is now a plain container with one fine border and no ornament, kept so
 * existing pages still build. The coloured tones keep their fill only so text already written for a dark ground stays
 * readable; restyle those pages to `tone="light"` (white, #ECE6DF border, ink text) or to a `Banner`, then drop it.
 */
export function OrnateFrame({ tone = "light", className = "", children }: { tone?: OrnateTone; className?: string; children: ReactNode }) {
  return (
    <div className={`relative border ${fields[tone]} ${className}`}>
      <div className="px-6 py-7 sm:px-9 sm:py-9">{children}</div>
    </div>
  );
}
