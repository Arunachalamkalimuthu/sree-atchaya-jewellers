"use client";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";
import { ContactSheet } from "@/components/ui/ContactSheet";
import { Icon } from "@/components/ui/Icon";

/** Floating "Chat with us" button on every site page. Opens ContactSheet (no WhatsApp link: this is a demo). */
export function WhatsAppFab() {
  const t = useT(common);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("fabLabel")}
        aria-haspopup="dialog"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex size-14 items-center justify-center gap-2 rounded-full border border-gold/70 bg-emerald text-gold-light shadow-[0_6px_18px_rgba(15,77,58,.35)] transition-colors hover:bg-[#0c3f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:bottom-6 sm:right-6 sm:h-12 sm:w-auto sm:px-5"
      >
        <Icon name="chat" size={22} />
        <span className="hidden text-[15px] text-ivory sm:inline">{t("fabLabel")}</span>
      </button>
      <ContactSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
