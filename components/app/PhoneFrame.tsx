"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { asset } from "@/lib/asset";
import { useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";

export const SCREEN = { w: 390, h: 844 };
const BEZEL = 12;
const OUTER = { w: SCREEN.w + BEZEL * 2, h: SCREEN.h + BEZEL * 2 };
const RIBBON = 28;
const MARGIN = 28;

/** The iframe address for the current app route: base path + pathname (with trailing slash) + search + framed=1. */
export function frameSrc(pathname: string, search: string): string {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const sp = new URLSearchParams(search);
  sp.delete("to");
  sp.set("framed", "1");
  return `${asset(path)}?${sp.toString()}`;
}

function useFit(): number {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - RIBBON - MARGIN * 2) / OUTER.h));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return scale;
}

/**
 * `<PhoneFrame />` (desktop, 1024 px and up): a 390×844 <iframe> of the current app route with ?framed=1, inside a
 * phone bezel with a 9:41 status bar and a home indicator drawn over the screen. The iframe gets a real phone-width
 * viewport, so every reused component (BuyBox, Passbook, OrderTracker…) lays out as it does on a phone.
 * The src is taken once from the route the page opened on; navigation then happens inside the iframe.
 * The whole phone scales down to fit short windows.
 */
export function PhoneFrame() {
  const t = useT(app);
  const pathname = usePathname() ?? "/app/";
  const [src] = useState(() => frameSrc(pathname, window.location.search));
  const scale = useFit();

  return (
    <div style={{ width: OUTER.w * scale, height: OUTER.h * scale }} className="relative shrink-0">
      <div
        className="absolute left-0 top-0 origin-top-left rounded-[62px] bg-[#1f1512] shadow-[0_30px_70px_-20px_rgba(74,13,15,.55),inset_0_0_0_1.5px_rgba(201,162,74,.35)]"
        style={{ width: OUTER.w, height: OUTER.h, padding: BEZEL, transform: `scale(${scale})` }}
      >
        {/* Side buttons */}
        <span aria-hidden className="absolute -left-[3px] top-[150px] h-8 w-[3px] rounded-l bg-[#2c201b]" />
        <span aria-hidden className="absolute -left-[3px] top-[210px] h-14 w-[3px] rounded-l bg-[#2c201b]" />
        <span aria-hidden className="absolute -left-[3px] top-[280px] h-14 w-[3px] rounded-l bg-[#2c201b]" />
        <span aria-hidden className="absolute -right-[3px] top-[230px] h-20 w-[3px] rounded-r bg-[#2c201b]" />

        <div className="relative overflow-hidden rounded-[50px] bg-maroon" style={{ width: SCREEN.w, height: SCREEN.h }}>
          <iframe
            src={src}
            title={t("frameTitle")}
            width={SCREEN.w}
            height={SCREEN.h}
            className="block border-0"
            data-testid="app-frame"
          />
          <StatusBar time={t("statusTime")} />
          <span aria-hidden className="pointer-events-none absolute bottom-[7px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-ivory/75" />
        </div>
      </div>
    </div>
  );
}

/** The phone's status bar, drawn over the app's maroon header: time, the camera island, signal, Wi-Fi, battery. */
function StatusBar({ time }: { time: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex h-[47px] items-center justify-between px-[34px] pt-1 text-ivory">
      <span className="num w-[60px] text-center text-[16px] font-semibold tracking-tight">{time}</span>
      <span className="absolute left-1/2 top-[11px] h-[34px] w-[122px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx=".7" /><rect x="5" y="5.5" width="3" height="6.5" rx=".7" /><rect x="10" y="3" width="3" height="9" rx=".7" /><rect x="15" y="0" width="3" height="12" rx=".7" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1.5 4.2a9.5 9.5 0 0113 0" /><path d="M4 7a6 6 0 018 0" /><circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none" /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".45" /><rect x="2.5" y="2.5" width="17" height="8" rx="2" fill="currentColor" /><path d="M25.2 4.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".45" /></svg>
      </span>
    </div>
  );
}
