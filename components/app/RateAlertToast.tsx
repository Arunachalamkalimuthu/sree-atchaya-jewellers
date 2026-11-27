"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RATES } from "@/lib/site.config";
import { formatINR } from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { useT } from "@/lib/i18n";
import { app } from "@/lib/i18n/dict/app";
import { Icon } from "@/components/ui/Icon";
import { Mark } from "@/components/brand/Wordmark";

const KEY = "sa-rate-alert";
export const RATE_ALERT_DELAY_MS = 3000;

function alreadyShown(): boolean {
  try { return window.sessionStorage.getItem(KEY) === "1"; } catch { return false; }
}

/**
 * `<RateAlertToast />`: the simulated rate-alert push, "Today's gold rate: 22K ₹…/g. Tap to buy Digi Gold.", built
 * from RATES. It drops in 3 s after the first app load of the browser session (sessionStorage "sa-rate-alert"),
 * once. Tapping it opens Digi Gold on the Scheme tab; the close button dismisses it.
 * Rendered only inside the app UI, never on the desktop frame page.
 */
export function RateAlertToast() {
  const t = useT(app);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const text = t("alertText", { rate: formatINR(RATES.g22) });

  useEffect(() => {
    if (alreadyShown()) return;
    const id = window.setTimeout(() => {
      try { window.sessionStorage.setItem(KEY, "1"); } catch { /* private mode: shows once per page load */ }
      setOpen(true);
    }, RATE_ALERT_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  if (!open) return null;

  return (
    <div
      role="status"
      className="sa-drop fixed inset-x-2 z-50 mx-auto max-w-md top-[calc(var(--app-top)+var(--status)+8px)]"
      data-testid="rate-alert"
    >
      <style>{`@keyframes sa-drop{from{transform:translateY(-120%);opacity:0}to{transform:none;opacity:1}}.sa-drop{animation:sa-drop .38s cubic-bezier(.2,.8,.2,1) both}@media (prefers-reduced-motion:reduce){.sa-drop{animation:none}}`}</style>
      <div className="relative flex items-stretch rounded-[14px] border border-[#ECE6DF] bg-white shadow-[0_10px_30px_rgba(31,21,18,.18)]">
        <button
          type="button"
          onClick={() => { setOpen(false); router.push(`${routes.app.scheme()}?tab=digi`); }}
          aria-label={text}
          className="flex min-w-0 flex-1 items-start gap-3 rounded-[14px] py-3 pl-3 pr-1 text-left focus-visible:outline-2 focus-visible:outline-maroon"
        >
          <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-[9px] bg-maroon">
            <Mark size={24} className="text-gold" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2 text-[12px] text-[#8A7F78]">
              <span className="font-semibold text-ink">{t("alertApp")}</span>
              <span>{t("alertNow")}</span>
            </span>
            <span className="num mt-0.5 block text-[14.5px] leading-snug text-ink">{text}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("alertDismiss")}
          className="grid w-10 shrink-0 place-items-center rounded-r-[14px] text-[#8A7F78] hover:text-ink focus-visible:outline-2 focus-visible:outline-maroon"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
    </div>
  );
}
