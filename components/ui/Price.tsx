import { formatINR } from "@/lib/pricing";

export type PriceSize = "sm" | "md" | "lg" | "xl";

const sizes: Record<PriceSize, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
  xl: "text-[2.75rem] leading-none",
};

/** Rupees in the display serif with Indian grouping (₹1,21,437). `strike` for a struck-through "was" price. */
export function Price({ value, size = "md", strike, className = "" }: { value: number; size?: PriceSize; strike?: boolean; className?: string }) {
  return (
    <span
      className={`font-display font-semibold tabular-nums [font-feature-settings:'lnum','tnum'] ${sizes[size]} ${strike ? "font-normal line-through decoration-1 opacity-60" : ""} ${className}`}
    >
      {formatINR(value)}
    </span>
  );
}
