import Link from "next/link";
import type { ReactNode } from "react";

/** Home section heading: display serif, sentence case, an optional plain line and an optional text link on the right. */
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
    <div className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-3 ${className}`}>
      <div className="max-w-2xl">
        <h2 id={id} className={`font-display text-[1.95rem] font-semibold leading-[1.1] sm:text-[2.5rem] ${dark ? "text-ivory" : "text-maroon"}`}>
          {title}
        </h2>
        {intro && <p className={`mt-2 text-[15px] leading-relaxed ${dark ? "text-ivory/70" : "text-ink/70"}`}>{intro}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className={`rounded-sm pb-0.5 text-[15px] underline decoration-1 underline-offset-[6px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
            dark ? "text-gold-light decoration-gold/60 hover:decoration-gold-light" : "text-maroon decoration-gold hover:text-maroon-deep"
          }`}
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
