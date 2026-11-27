"use client";
import { useT } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";

/** The required preview notice, fixed at the very top. A quiet neutral strip so it reads apart from the rate ticker. */
export function DemoRibbon() {
  const t = useT(common);
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[100] flex h-7 items-center justify-center border-b border-line bg-[#f4f1ec] px-3 text-center text-[10.5px] leading-tight text-mute sm:text-[11.5px]"
    >
      <span className="line-clamp-2">{t("ribbon")}</span>
    </div>
  );
}
