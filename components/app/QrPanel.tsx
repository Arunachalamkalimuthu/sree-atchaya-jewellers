"use client";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { LangToggle } from "@/components/ui/LangToggle";
import { Wordmark } from "@/components/brand/Wordmark";
import { APP_PUBLIC_URL } from "./app-url";

/**
 * `<QrPanel qr>`: the side panel next to the desktop phone frame. "This is the mobile app. Scan to open it on your
 * phone." plus the QR for the public app address (APP_PUBLIC_URL, never window.location, so it is right on
 * localhost too). `qr` is the module path made on the server by qrPath().
 */
export function QrPanel({ qr }: { qr: { size: number; d: string } }) {
  const t = useT(app);
  const shown = APP_PUBLIC_URL.replace(/^https:\/\//, "");
  return (
    <aside className="w-full max-w-[380px]">
      <Wordmark size="md" />
      <h1 className="mt-10 font-display text-[2.35rem] font-semibold leading-[1.08] text-maroon">{t("qrTitle")}</h1>
      <p className="mt-3 text-[18px] leading-snug text-ink/80">{t("qrLead")}</p>

      <figure className="mt-8 inline-block border border-gold p-[3px]">
        <div className="border border-gold/45 bg-white p-4">
          <svg
            role="img"
            aria-label={t("qrAlt")}
            viewBox={`-2 -2 ${qr.size + 4} ${qr.size + 4}`}
            width={200}
            height={200}
            shapeRendering="crispEdges"
            className="block"
            data-testid="app-qr"
            data-url={APP_PUBLIC_URL}
          >
            <rect x={-2} y={-2} width={qr.size + 4} height={qr.size + 4} fill="#ffffff" />
            <path d={qr.d} fill="#4a0d0f" />
          </svg>
        </div>
      </figure>
      <p className="mt-3 break-all text-[13px] text-ink/60">{shown}</p>

      <div className="mt-8 space-y-3 border-t border-gold/40 pt-6 text-[15px] leading-relaxed text-ink/75">
        <p>{t("qrInstall")}</p>
        <p>{t("qrShared")}</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <LangToggle />
        <Link
          href={routes.home()}
          className="text-[15px] text-maroon underline decoration-gold decoration-1 underline-offset-4 hover:text-maroon-deep focus-visible:outline-2 focus-visible:outline-gold"
        >
          {t("qrWebsite")}
        </Link>
      </div>
    </aside>
  );
}
