"use client";
import Link from "next/link";
import { createContext, useContext, useSyncExternalStore, type ComponentProps } from "react";

/**
 * How the /app/* routes are being shown:
 * - "framed": inside the desktop phone frame's <iframe> (or opened with ?framed=1). The app renders full-screen
 *   at the iframe's 390 px viewport; links to website pages break out with target="_top".
 * - "phone": a real phone or any viewport under 1024 px. The app renders full-screen.
 * - "desktop": 1024 px and up, top level. The layout shows the phone frame and the QR panel instead.
 * - "pending": server render and hydration. A plain maroon splash, so the static HTML never guesses the viewport.
 */
export type AppMode = "pending" | "framed" | "phone" | "desktop";

const DESKTOP = "(min-width: 1024px)";

function readMode(): Exclude<AppMode, "pending"> {
  let inFrame = false;
  try { inFrame = window.self !== window.top; } catch { inFrame = true; }
  if (inFrame || new URLSearchParams(window.location.search).get("framed") === "1") return "framed";
  return window.matchMedia(DESKTOP).matches ? "desktop" : "phone";
}

function subscribe(cb: () => void) {
  const mql = window.matchMedia(DESKTOP);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

export function useAppMode(): AppMode {
  return useSyncExternalStore(subscribe, readMode, () => "pending");
}

const FramedCtx = createContext(false);
export const FramedProvider = FramedCtx.Provider;

/** True when the app runs inside the desktop phone frame. */
export function useFramed(): boolean {
  return useContext(FramedCtx);
}

/**
 * A link from the app to a website page (cart, custom order, sell gold…). Inside the phone frame it opens in the
 * top window, so the website gets the whole desktop screen instead of rendering inside the phone.
 */
export function SiteLink(props: ComponentProps<typeof Link>) {
  const framed = useFramed();
  return <Link {...props} target={framed ? "_top" : props.target} />;
}

const btn = {
  maroon: "bg-maroon text-ivory shadow-[inset_0_1px_0_rgba(232,199,122,.25)] hover:bg-maroon-deep",
  ghost: "border border-maroon/35 text-maroon hover:border-gold hover:bg-gold/10",
};

/** SiteLink drawn as a full-width app button (the kit's Button does not pass `target` through). */
export function SiteButton({ variant = "maroon", className = "", ...props }: ComponentProps<typeof Link> & { variant?: keyof typeof btn }) {
  return (
    <SiteLink
      {...props}
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-[3px] px-5 text-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${btn[variant]} ${className}`}
    />
  );
}
