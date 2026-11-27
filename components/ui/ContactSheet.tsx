"use client";
import { useState } from "react";
import { ADDRESS_VARS, SITE } from "@/lib/site.config";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { Sheet } from "./Sheet";
import { Icon } from "./Icon";

export type ContactTopic = "general" | "goldRelease" | "goldCoins";

/**
 * `<ContactSheet open onClose topic?>`: every Call / WhatsApp / "Ask on WhatsApp" action opens this.
 * Numbers are plain text (copyable), never phone-dialler or WhatsApp links. Always says the demo isn't connected to the shop (common.contactDemo).
 */
export function ContactSheet({ open, onClose, topic = "general" }: { open: boolean; onClose: () => void; topic?: ContactTopic }) {
  const t = useT(common);

  const title = topic === "goldRelease" ? t("contactTitleRelease") : topic === "goldCoins" ? t("contactTitleCoins") : t("contactTitle");
  const intro = topic === "goldRelease" ? t("contactIntroRelease") : topic === "goldCoins" ? t("contactIntroCoins") : t("contactIntro");

  const lines: { label: string; number: string }[] =
    topic === "goldRelease"
      ? [{ label: t("contactRelease"), number: SITE.phones.goldRelease }, { label: t("contactEnquiry"), number: SITE.phones.enquiry }]
      : topic === "goldCoins"
        ? [{ label: t("contactCoins"), number: SITE.phones.goldCoins }, { label: t("contactEnquiry"), number: SITE.phones.enquiry }]
        : [
            { label: t("contactEnquiry"), number: SITE.phones.enquiry },
            { label: t("footerMainRelease"), number: SITE.phones.main },
            { label: t("contactAlt"), number: SITE.phones.alt },
          ];

  return (
    <Sheet open={open} onClose={onClose} title={title} width="md">
      <p className="text-[15px] leading-relaxed text-mute">{intro}</p>

      <ul className="mt-5 divide-y divide-line border-y border-line">
        {lines.map((l) => <NumberRow key={l.label} {...l} />)}
      </ul>

      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-sm">
        <dt className="flex items-center gap-2 text-mute"><Icon name="clock" size={16} />{t("contactHoursLabel")}</dt>
        <dd className="text-ink">{t("footerHours")}</dd>
        <dt className="flex items-center gap-2 text-mute"><Icon name="pin" size={16} />{t("contactMain")}</dt>
        <dd className="text-ink">{t("footerAddress", ADDRESS_VARS)}</dd>
        <dt className="flex items-center gap-2 text-mute"><Icon name="mail" size={16} />{t("footerEmail")}</dt>
        <dd className="min-w-0 select-all break-all text-ink">{SITE.email}</dd>
        <dt className="flex items-center gap-2 text-mute"><Icon name="instagram" size={16} />{t("contactInstagramLabel")}</dt>
        <dd className="text-ink">@{SITE.social.instagram}</dd>
        <dt className="flex items-center gap-2 text-mute"><Icon name="facebook" size={16} />{t("footerFacebook")}</dt>
        <dd className="text-ink">{SITE.social.facebook}</dd>
      </dl>

      <div role="note" className="mt-6 rounded-[4px] border border-line bg-cream px-4 py-3">
        <p className="text-[14px] font-semibold text-maroon">{t("contactDemo")}</p>
        <p className="mt-1 text-[13.5px] leading-snug text-mute">{t("contactDemoNote")}</p>
      </div>
    </Sheet>
  );
}

function NumberRow({ label, number }: { label: string; number: string }) {
  const t = useT(common);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(number.replace(/\s/g, "")); } catch { /* clipboard blocked: the number is still visible */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <li className="flex items-center justify-between gap-3 py-3.5">
      <div className="min-w-0">
        <p className="text-[13.5px] text-mute">{label}</p>
        <p className="mt-0.5 select-all text-[22px] font-semibold tracking-wide text-ink tabular-nums">{number}</p>
        <p className="text-[13px] text-mute">{t("contactWays")}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-[4px] border border-maroon/45 px-3 text-[13.5px] font-semibold text-maroon transition-colors hover:border-maroon hover:bg-maroon/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <Icon name={copied ? "check" : "copy"} size={15} />
        <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
      </button>
    </li>
  );
}
