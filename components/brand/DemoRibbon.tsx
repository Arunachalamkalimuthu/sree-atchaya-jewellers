"use client";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";

export function DemoRibbon() {
  const t = useT(common);
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[100] flex h-7 items-center justify-center bg-maroon-deep px-3 text-center text-[10.5px] leading-tight tracking-wide text-gold-light sm:text-[11px]"
    >
      <span className="line-clamp-2">{t("ribbon")}</span>
    </div>
  );
}
