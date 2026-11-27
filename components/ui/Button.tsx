import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

/**
 * v2 tune. On white: `maroon` (primary, solid) and `ghost` (secondary, maroon outline). On photos: `light` (white
 * solid, maroon text) and `ghost-light` (white outline). There is no gold button.
 */
export type ButtonVariant = "maroon" | "ghost" | "light" | "ghost-light";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 rounded-[4px] font-semibold " +
  "transition-[background-color,color,border-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 text-center";

const variants: Record<ButtonVariant, string> = {
  maroon: "bg-maroon text-white hover:bg-maroon-deep",
  ghost: "border border-maroon/45 bg-white/0 text-maroon hover:border-maroon hover:bg-maroon/[0.04]",
  light: "bg-white text-maroon hover:bg-cream",
  "ghost-light": "border border-white/70 bg-transparent text-white hover:border-white hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3.5 text-[13.5px]",
  md: "min-h-11 px-5 text-[15px]",
  lg: "min-h-12 px-7 text-[15.5px]",
};

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Internal path from lib/routes.ts. Renders a link instead of a button. */
  href?: string;
  /** Stretch to the container width. */
  full?: boolean;
  className?: string;
  children: ReactNode;
}

/** Props that make sense on a link too: aria-*, data-*, id, title, tabIndex, lang, role. */
function linkSafe(rest: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (k.startsWith("aria-") || k.startsWith("data-") || ["id", "title", "tabIndex", "lang", "role"].includes(k)) out[k] = v;
  }
  return out;
}

/**
 * `<Button variant="maroon"|"ghost"|"light"|"ghost-light" href? onClick?>`. Pass `href` (from `routes`) for navigation:
 * aria-*, data-*, id, title, tabIndex, lang and role pass through to the link; `disabled` becomes aria-disabled
 * (not focusable, not clickable, dimmed).
 */
export function Button({ variant = "maroon", size = "md", href, full, className = "", children, type = "button", onClick, disabled, ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`;
  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        // Same event shape at runtime; the type keeps the button signature callers already use.
        onClick={onClick as unknown as MouseEventHandler<HTMLAnchorElement>}
        {...linkSafe(rest)}
        {...(disabled ? { "aria-disabled": true, tabIndex: -1 } : {})}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
