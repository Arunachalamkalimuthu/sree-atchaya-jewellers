"use client";
import { Suspense, useEffect, type CSSProperties, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { Mark } from "@/components/brand/Wordmark";
import { FramedProvider, useAppMode } from "./frame";
import { PhoneFrame } from "./PhoneFrame";
import { QrPanel } from "./QrPanel";
import { TabBar } from "./TabBar";
import { RateAlertToast } from "./RateAlertToast";

// Inside the phone frame the outer page already shows the preview ribbon: hide the iframe's copy and its body offset.
const HIDE_RIBBON = "body{padding-top:0!important}body>[role=note]{display:none!important}";

/**
 * Chooses how /app/* is shown (see useAppMode):
 * - framed (inside the desktop iframe) or phone (under 1024 px): the app itself, full-screen, with the TabBar
 *   and the rate alert;
 * - desktop (1024 px and up): PhoneFrame (an iframe of this same route with ?framed=1) beside QrPanel;
 * - pending (server and hydration): a maroon splash, the same first frame a native app shows.
 */
export function AppShell({ qr, children }: { qr: { size: number; d: string }; children: ReactNode }) {
  const mode = useAppMode();

  if (mode === "pending") return <Splash />;

  if (mode === "desktop") {
    return (
      <div className="flex min-h-[calc(100dvh-1.75rem)] items-center justify-center gap-16 bg-ivory px-10 py-7 xl:gap-28">
        <PhoneFrame />
        <QrPanel qr={qr} />
      </div>
    );
  }

  const framed = mode === "framed";
  const vars = {
    "--app-top": framed ? "0px" : "1.75rem",
    "--status": framed ? "47px" : "0px",
    "--home-ind": framed ? "20px" : "env(safe-area-inset-bottom, 0px)",
  } as CSSProperties;

  return (
    <FramedProvider value={framed}>
      {framed && <style>{HIDE_RIBBON}</style>}
      {framed && <Suspense fallback={null}><SyncParentUrl /></Suspense>}
      <div style={vars} className="flex min-h-[calc(100dvh-var(--app-top))] flex-col bg-ivory">
        <div className="flex flex-1 flex-col pb-[calc(60px+var(--home-ind))]">{children}</div>
        <TabBar />
        <RateAlertToast />
      </div>
    </FramedProvider>
  );
}

function Splash() {
  const t = useT(app);
  return (
    <div role="status" aria-label={t("splash")} className="grid min-h-[calc(100dvh-1.75rem)] place-items-center bg-maroon">
      <Mark size={56} className="text-gold" />
    </div>
  );
}

/**
 * Inside the frame, mirror the app route onto the desktop page's address (replaceState, no reload), so a refresh
 * or a copied link opens the same screen. The outer iframe src is fixed at mount, so this never reloads the frame.
 */
function SyncParentUrl() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    try {
      if (window.parent === window) return;
      const sp = new URLSearchParams(window.location.search);
      sp.delete("framed");
      sp.delete("to"); // the one-shot cart hand-off must not be replayed by a refresh or Back
      const qs = sp.toString();
      const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
      const p = window.parent;
      if (p.location.pathname + p.location.search !== url) p.history.replaceState(p.history.state, "", url);
    } catch { /* cross-origin parent: leave it */ }
  }, [pathname, search]);
  return null;
}
