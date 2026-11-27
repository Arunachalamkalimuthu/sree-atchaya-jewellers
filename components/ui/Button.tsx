import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "gold" | "maroon" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 rounded-[3px] font-medium tracking-[0.01em] " +
  "transition-[background-color,color,box-shadow,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50 text-center";

const variants: Record<ButtonVariant, string> = {
  // Antique-gold face: the primary action.
  gold:
    "bg-gold text-maroon-deep shadow-[inset_0_1px_0_rgba(255,255,255,.35)] hover:bg-gold-light",
  maroon:
    "bg-maroon text-ivory shadow-[inset_0_1px_0_rgba(232,199,122,.25)] hover:bg-maroon-deep",
  ghost:
    "border border-current/35 bg-transparent text-maroon hover:border-gold hover:bg-gold/10",
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

/** `<Button variant="gold"|"maroon"|"ghost" href? onClick?>`. Pass `href` (from `routes`) for navigation. */
export function Button({ variant = "gold", size = "md", href, full, className = "", children, type = "button", ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} onClick={rest.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
