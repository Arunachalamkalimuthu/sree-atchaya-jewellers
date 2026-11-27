"use client";
import { useState } from "react";
import { SITE } from "@/lib/site.config";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { home } from "@/lib/i18n/dict/home";
import { Button } from "@/components/ui/Button";
import { ContactSheet, type ContactTopic } from "@/components/ui/ContactSheet";
import { Icon } from "@/components/ui/Icon";

/**
 * Centre of the 641001 area (Town Hall, Coimbatore) for the OpenStreetMap embed. The shop's exact location is not
 * in site.config yet; swap these when it is.
 */
const MAP = { lat: 10.995, lon: 76.961, span: 0.016 };
const MAP_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=" +
  encodeURIComponent([MAP.lon - MAP.span, MAP.lat - MAP.span / 1.6, MAP.lon + MAP.span, MAP.lat + MAP.span / 1.6].map((n) => n.toFixed(4)).join(",")) +
  `&layer=mapnik&marker=${encodeURIComponent(`${MAP.lat},${MAP.lon}`)}`;

/**
 * Visit us (`#visit`, the header's "Visit Us"): address, hours and numbers as text, an OSM map over a designed
 * fallback panel (pin icon, "Coimbatore 641001", exact pin later), ContactSheet.
 */
export function VisitUs() {
  const t = useT(home);
  const c = useT(common);
  const [topic, setTopic] = useState<ContactTopic | null>(null);
  const phones = [
    { label: c("footerMainRelease"), number: SITE.phones.main },
    { label: c("contactAlt"), number: SITE.phones.alt },
    { label: c("footerGoldCoins"), number: SITE.phones.goldCoins },
  ];

  return (
    <section id="visit" aria-labelledby="visit-title" className="scroll-mt-28 border-t border-line bg-cream lg:scroll-mt-32">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_1.35fr] lg:gap-14 lg:px-8">
        <div>
          <h2 id="visit-title" className="text-[22px] font-semibold leading-tight text-ink sm:text-[28px]">{t("visitTitle")}</h2>
          <address className="mt-5 not-italic">
            <span className="block text-[17px] font-semibold text-ink">{c("brandName")} {c("brandSub")}</span>
            <span className="mt-0.5 block text-[15px] text-mute">{c("footerAddress", { pin: SITE.address.pin })}</span>
          </address>
          <p className="mt-2 flex items-center gap-2 text-[15px] text-mute"><Icon name="clock" size={17} className="text-maroon" />{c("footerHours")}</p>
          <p className="mt-2 text-[14.5px] leading-relaxed text-mute">{t("visitBring")}</p>

          <ul className="mt-6 divide-y divide-line border-y border-line">
            {phones.map((p) => (
              <li key={p.label} className="flex flex-wrap items-baseline justify-between gap-x-4 py-3">
                <span className="text-[13.5px] text-mute">{p.label}</span>
                <span className="whitespace-nowrap text-[16px] font-semibold tracking-wide text-ink tabular-nums">{p.number}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="maroon" onClick={() => setTopic("general")} aria-haspopup="dialog">
              <Icon name="phone" size={17} />
              {c("footerCall")}
            </Button>
            <Button variant="ghost" onClick={() => setTopic("goldRelease")} aria-haspopup="dialog">{c("contactRelease")}</Button>
          </div>
        </div>

        <figure className="flex flex-col">
          <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-[6px] border border-line bg-cream sm:min-h-[380px]">
            {/* Shown until the map loads, and if it never does (offline, blocked). The loaded map paints over it. */}
            <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="grid size-14 place-items-center rounded-full border border-line bg-white text-maroon">
                <Icon name="pin" size={26} />
              </span>
              <p className="text-[18px] font-semibold text-ink">{t("visitMapPlace", { pin: SITE.address.pin })}</p>
              <p className="max-w-xs text-[14px] leading-relaxed text-mute">{t("visitMapFallback")}</p>
            </div>
            <iframe
              title={t("visitMapTitle", { pin: SITE.address.pin })}
              src={MAP_SRC}
              loading="lazy"
              className="absolute inset-0 size-full border-0"
            />
          </div>
          <figcaption className="mt-2 text-[13px] text-mute">{t("visitMapNote", { pin: SITE.address.pin })}</figcaption>
        </figure>
      </div>
      <ContactSheet open={topic !== null} onClose={() => setTopic(null)} topic={topic ?? "general"} />
    </section>
  );
}
