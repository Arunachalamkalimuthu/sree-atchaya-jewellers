"use client";
import { ORDER_STEPS, type OrderStatus } from "@/lib/demo-state";
import { useT } from "@/lib/i18n";
import { checkout } from "@/lib/i18n/dict/checkout";
import { Icon } from "@/components/ui/Icon";

type LabelKey = "trackBooked" | "trackDesign_approved" | "trackMaking" | "trackHallmarked" | "trackReady";
const labelKey = (s: OrderStatus) => `track${s[0].toUpperCase()}${s.slice(1)}` as LabelKey;

/**
 * `<OrderTracker status vertical?>`: the five steps an order really goes through, in order.
 * Horizontal on wide screens, stacked on phones; `vertical` forces the stacked form (the mobile app uses it).
 */
export function OrderTracker({ status, vertical = false, className = "" }: { status: OrderStatus; vertical?: boolean; className?: string }) {
  const t = useT(checkout);
  const at = ORDER_STEPS.indexOf(status);

  return (
    <ol aria-label={t("trackLabel")} className={`flex ${vertical ? "flex-col" : "flex-col sm:flex-row"} ${className}`}>
      {ORDER_STEPS.map((step, i) => {
        const done = i < at;
        const current = i === at;
        const last = i === ORDER_STEPS.length - 1;
        return (
          <li
            key={step}
            aria-current={current ? "step" : undefined}
            className={`relative flex ${vertical ? "flex-row gap-4 pb-6 last:pb-0" : "flex-row gap-4 pb-6 last:pb-0 sm:flex-1 sm:flex-col sm:gap-3 sm:pb-0"}`}
          >
            {/* Connector to the next step. */}
            {!last && (
              <span
                aria-hidden
                className={`absolute ${done ? "bg-gold" : "bg-maroon/20"} ${
                  vertical ? "left-[15px] top-8 h-[calc(100%-2rem)] w-px" : "left-[15px] top-8 h-[calc(100%-2rem)] w-px sm:left-8 sm:top-[15px] sm:h-px sm:w-[calc(100%-2rem)]"
                }`}
              />
            )}
            <span
              className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border font-display text-base font-semibold num ${
                done ? "border-gold bg-gold text-maroon-deep" : current ? "border-maroon bg-maroon text-gold-light" : "border-maroon/25 bg-ivory text-maroon/50"
              }`}
            >
              {done ? <Icon name="check" size={16} /> : i + 1}
            </span>
            <span className="min-w-0 pt-1 sm:pt-0 sm:pr-3">
              <span className={`block text-[15px] leading-snug ${current ? "font-semibold text-maroon" : done ? "text-maroon-deep" : "text-ink/50"}`}>
                {t(labelKey(step))}
              </span>
              {(done || current) && <span className="block text-[13px] text-ink/55">{current ? t("trackCurrent") : t("trackDone")}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
