import Link from "next/link";
import type { ReactNode } from "react";

/**
 * `<SectionHead id title intro? link?>`: v2 section heading. Mukta Malar semibold (22/28 px) in ink, an optional grey
 * line under it and an optional "View all" text link on the right. `tone="dark"` on maroon or photo grounds.
 */
export function SectionHead({
  id, title, intro, link, tone = "light", className = "",
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  link?: { href: string; label: string };
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-2 ${className}`}>
      <div className="max-w-2xl">
        <h2 id={id} className={`text-[22px] font-semibold leading-tight sm:text-[28px] ${dark ? "text-white" : "text-ink"}`}>
          {title}
        </h2>
        {intro && <p className={`mt-1 text-[14.5px] leading-relaxed ${dark ? "text-white/75" : "text-mute"}`}>{intro}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className={`rounded-sm pb-0.5 text-[15px] font-semibold underline decoration-1 underline-offset-[5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
            dark ? "text-white decoration-white/50 hover:decoration-white" : "text-maroon decoration-maroon/35 hover:decoration-maroon"
          }`}
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
