/** Thin-stroke line icons (1.5px), drawn for this site. No icon font, no emoji. */
import type { SVGProps } from "react";

export type IconName =
  | "menu" | "close" | "bag" | "user" | "chat" | "phone" | "copy" | "check" | "chevron-right" | "chevron-left"
  | "upi" | "card" | "bank" | "pin" | "clock" | "instagram" | "lock"
  | "search" | "heart" | "hallmark" | "percent" | "scale" | "unlock" | "pause" | "play";

const paths: Record<IconName, React.ReactNode> = {
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  bag: <><path d="M5.5 8h13l-1 12h-11z" /><path d="M9 8V6.5a3 3 0 016 0V8" /></>,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" /></>,
  chat: <><path d="M4.5 18.5l1.2-3.4A7.5 7.5 0 1112 19.5a7.6 7.6 0 01-3.6-.9z" /><path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" strokeWidth={2.2} /></>,
  phone: <path d="M7 4h3l1.5 4-2 1.3a10 10 0 005.2 5.2L16 12.5l4 1.5v3a2 2 0 01-2 2A15 15 0 015 6a2 2 0 012-2z" />,
  copy: <><rect x="8.5" y="8.5" width="11" height="11" rx="1.5" /><path d="M15.5 8.5V6a1.5 1.5 0 00-1.5-1.5H6A1.5 1.5 0 004.5 6v8A1.5 1.5 0 006 15.5h2.5" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  "chevron-right": <path d="M9.5 6l6 6-6 6" />,
  "chevron-left": <path d="M14.5 6l-6 6 6 6" />,
  upi: <><path d="M7 4l5 8-5 8" /><path d="M12 4l5 8-5 8" /></>,
  card: <><rect x="3.5" y="6" width="17" height="12" rx="1.5" /><path d="M3.5 10h17M7 15h4" /></>,
  bank: <><path d="M4 9.5L12 5l8 4.5" /><path d="M5.5 10v7M10 10v7M14 10v7M18.5 10v7M4 19.5h16" /></>,
  pin: <><path d="M12 20.5s-6-5.6-6-10.5a6 6 0 0112 0c0 4.9-6 10.5-6 10.5z" /><circle cx="12" cy="10" r="2.2" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></>,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><path d="M16.8 7.2h.01" strokeWidth={2.2} /></>,
  lock: <><rect x="5.5" y="10.5" width="13" height="9" rx="1.5" /><path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l4.5 4.5" /></>,
  heart: <path d="M12 19.5s-7-4.3-7-9.4A3.9 3.9 0 0112 7.6a3.9 3.9 0 017 2.5c0 5.1-7 9.4-7 9.4z" />,
  // A hallmark seal: shield with a tick.
  hallmark: <><path d="M12 3.5l6.5 2.5v5.2c0 4.3-2.8 7.5-6.5 9.3-3.7-1.8-6.5-5-6.5-9.3V6z" /><path d="M9 12l2.2 2.2L15.2 10" /></>,
  percent: <><path d="M18 6L6 18" /><circle cx="7.5" cy="7.5" r="2.2" /><circle cx="16.5" cy="16.5" r="2.2" /></>,
  scale: <><path d="M12 4v15M7 19.5h10M5 7.5h14" /><path d="M5 7.5l-2.5 6a2.5 2.5 0 005 0zM19 7.5l-2.5 6a2.5 2.5 0 005 0z" /></>,
  unlock: <><rect x="5.5" y="10.5" width="13" height="9" rx="1.5" /><path d="M8.5 10.5V8a3.5 3.5 0 016.7-1.4" /><path d="M12 14v2" /></>,
  pause: <path d="M9 6.5v11M15 6.5v11" strokeWidth={2} />,
  play: <path d="M8.5 6v12l9.5-6z" />,
};

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}
    >
      {paths[name]}
    </svg>
  );
}
