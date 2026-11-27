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

/** Visit us (`#visit`, the header's "Visit Us"): address, hours and numbers as text, an OSM map, ContactSheet. */
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
    <section id="visit" aria-labelledby="visit-title" className="scroll-mt-28 border-t border-gold/40 bg-gold/10 lg:scroll-mt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.35fr] lg:gap-14 lg:px-8">
        <div>
          <h2 id="visit-title" className="font-display text-[1.95rem] font-semibold leading-[1.1] text-maroon sm:text-[2.5rem]">{t("visitTitle")}</h2>
          <address className="mt-5 not-italic">
            <span className="block font-display text-[1.45rem] font-semibold text-maroon-deep">{c("brandName")} {c("brandSub")}</span>
            <span className="mt-1 block text-[15.5px] text-ink/80">{c("footerAddress", { pin: SITE.address.pin })}</span>
          </address>
          <p className="mt-3 flex items-center gap-2 text-[15px] text-ink/80"><Icon name="clock" size={17} className="text-maroon/70" />{c("footerHours")}</p>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink/70">{t("visitBring")}</p>

          <ul className="mt-6 divide-y divide-gold/35 border-y border-gold/35">
            {phones.map((p) => (
              <li key={p.label} className="flex flex-wrap items-baseline justify-between gap-x-4 py-3">
                <span className="text-[13.5px] text-ink/65">{p.label}</span>
                <span className="whitespace-nowrap font-display text-[1.35rem] font-semibold tracking-wide text-maroon-deep num">{p.number}</span>
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
          <div className="relative min-h-[300px] flex-1 border border-gold/60 bg-ivory p-1.5 sm:min-h-[380px]">
            <iframe
              title={t("visitMapTitle", { pin: SITE.address.pin })}
              src={MAP_SRC}
              loading="lazy"
              className="absolute inset-1.5 size-[calc(100%-12px)] border-0"
            />
          </div>
          <figcaption className="mt-2 text-[13px] text-ink/60">{t("visitMapNote", { pin: SITE.address.pin })}</figcaption>
        </figure>
      </div>
      <ContactSheet open={topic !== null} onClose={() => setTopic(null)} topic={topic ?? "general"} />
    </section>
  );
}
