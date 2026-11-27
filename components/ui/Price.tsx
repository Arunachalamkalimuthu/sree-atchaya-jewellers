import { formatINR } from "@/lib/pricing";

export type PriceSize = "sm" | "md" | "lg" | "xl";

const sizes: Record<PriceSize, string> = {
  sm: "text-[15px]",
  md: "text-[18px]",
  lg: "text-[28px] leading-tight",
  xl: "text-[36px] leading-none",
};

/** Rupees with Indian grouping (₹1,21,437) in Mukta Malar semibold, tabular figures. Colour comes from the caller (maroon on white). `strike` for a struck-through "was" price. */
export function Price({ value, size = "md", strike, className = "" }: { value: number; size?: PriceSize; strike?: boolean; className?: string }) {
  return (
    <span className={`font-sans font-semibold tabular-nums ${sizes[size]} ${strike ? "font-normal line-through decoration-1 opacity-60" : ""} ${className}`}>
      {formatINR(value)}
    </span>
  );
}
