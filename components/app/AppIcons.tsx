/** App line icons (1.5 px stroke, 24 grid), drawn from the shop's own objects. No emoji, no icon font. */
import type { SVGProps } from "react";

export type AppIconName = "home" | "shop" | "scheme" | "orders" | "profile" | "passbook" | "coin" | "sketch" | "scale" | "bell" | "back";

const paths: Record<AppIconName, React.ReactNode> = {
  // A showroom niche: arch, plinth and a small door arch.
  home: <><path d="M4.5 20.5V11a7.5 7.5 0 0115 0v9.5" /><path d="M2.5 20.5h19" /><path d="M9.5 20.5v-3.5a2.5 2.5 0 015 0v3.5" /></>,
  // A necklace with a drop pendant.
  shop: <><path d="M5 4.5c0 6.2 3.1 10 7 10s7-3.8 7-10" /><path d="M12 14.5l-2 2.8 2 3.2 2-3.2z" /></>,
  // Stacked coins.
  scheme: <><ellipse cx="12" cy="6.5" rx="6.5" ry="2.5" /><path d="M5.5 6.5v4c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-4" /><path d="M5.5 10.5v4c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-4" /><path d="M5.5 14.5v3c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-3" /></>,
  // An order slip on a clipboard.
  orders: <><rect x="5.5" y="4.5" width="13" height="16" rx="1.5" /><path d="M9.5 4.5V3h5v1.5" /><path d="M8.5 10h7M8.5 13.5h7M8.5 17h4" /></>,
  profile: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" /></>,
  // Passbook with a rupee sign.
  passbook: <><path d="M5.5 4.5h11a2 2 0 012 2v14h-11a2 2 0 01-2-2z" /><path d="M5.5 18.5a2 2 0 012-2h11" /><path d="M9.5 7.5h5M9.5 9.5h5M11 7.5c2.6 0 2.6 4 0 4h-1.5l3.8 2.8" /></>,
  coin: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="5.3" /><path d="M12 9.6l2.4 2.4-2.4 2.4-2.4-2.4z" /></>,
  // A pencil drawing a curve: custom design.
  sketch: <><path d="M3.5 19c3-4.5 6-5 8.5-3" /><path d="M13.5 15.5l6-6-2.5-2.5-6 6-.8 3.3z" /></>,
  // The counter weighing scale.
  scale: <><path d="M12 4.5v14.5M8 19h8M5 7.5h14" /><path d="M5 7.5L2.8 13a2.3 2.3 0 004.4 0zM19 7.5L16.8 13a2.3 2.3 0 004.4 0z" /><circle cx="12" cy="4" r="1" /></>,
  bell: <><path d="M6.5 16.5V11a5.5 5.5 0 0111 0v5.5l1.5 1.5h-14z" /><path d="M10 20a2 2 0 004 0" /></>,
  back: <path d="M14.5 6l-6 6 6 6" />,
};

export function AppIcon({ name, size = 24, strokeWidth = 1.5, ...rest }: { name: AppIconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}
    >
      {paths[name]}
    </svg>
  );
}
