import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

/** "ghost-light" is the outline button for dark grounds (maroon, emerald, plum bands, OrnateFrame, footer). */
export type ButtonVariant = "gold" | "maroon" | "ghost" | "ghost-light";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 rounded-[3px] font-medium tracking-[0.01em] " +
  "transition-[background-color,color,box-shadow,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 text-center";

const variants: Record<ButtonVariant, string> = {
  // Antique-gold face: the primary action.
  gold: "bg-gold text-maroon-deep shadow-[inset_0_1px_0_rgba(255,255,255,.35)] hover:bg-gold-light",
  maroon: "bg-maroon text-ivory shadow-[inset_0_1px_0_rgba(232,199,122,.25)] hover:bg-maroon-deep",
  ghost: "border border-current/35 bg-transparent text-maroon hover:border-gold hover:bg-gold/10",
  "ghost-light": "border border-gold/60 bg-transparent text-gold-light hover:border-gold-light hover:bg-gold/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3.5 text-[13px]",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-[15px]",
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
 * `<Button variant="gold"|"maroon"|"ghost"|"ghost-light" href? onClick?>`. Pass `href` (from `routes`) for navigation:
 * aria-*, data-*, id, title, tabIndex, lang and role pass through to the link; `disabled` becomes aria-disabled
 * (not focusable, not clickable, dimmed).
 */
export function Button({ variant = "gold", size = "md", href, full, className = "", children, type = "button", onClick, disabled, ...rest }: Props) {
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
