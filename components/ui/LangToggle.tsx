"use client";
import { useLang, useT, type Lang } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";

const OPTIONS: { id: Lang; label: string; lang: string }[] = [
  { id: "en", label: "English", lang: "en" },
  { id: "ta", label: "தமிழ்", lang: "ta" },
];

/**
 * English / தமிழ் switch. `tone="light"` on white (header, drawer), `"dark"` on maroon or photos.
 * `compact`: one small button naming the other language (phone headers).
 */
export function LangToggle({ tone = "light", compact = false, className = "" }: { tone?: "light" | "dark"; compact?: boolean; className?: string }) {
  const [lang, setLang] = useLang();
  const t = useT(common);
  const dark = tone === "dark";
  if (compact) {
    const other = OPTIONS.find((o) => o.id !== lang)!;
    return (
      <button
        type="button"
        lang={other.lang}
        onClick={() => setLang(other.id)}
        aria-label={`${t("language")}: ${other.label}`}
        className={`min-h-8 rounded-full border px-2.5 text-[13px] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-gold ${
          dark ? "border-white/45 text-white hover:bg-white/10" : "border-line text-maroon hover:border-maroon/40"
        } ${className}`}
      >
        {other.id === "en" ? "EN" : other.label}
      </button>
    );
  }
  return (
    <div role="group" aria-label={t("language")} className={`inline-flex rounded-full border p-0.5 ${dark ? "border-white/40" : "border-line"} ${className}`}>
      {OPTIONS.map((o) => {
        const active = lang === o.id;
        return (
          <button
            key={o.id}
            type="button"
            lang={o.lang}
            aria-pressed={active}
            onClick={() => setLang(o.id)}
            className={`min-h-8 rounded-full px-3 text-[13px] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold ${
              active
                ? dark ? "bg-white text-maroon" : "bg-maroon text-white"
                : dark ? "text-white/80 hover:text-white" : "text-mute hover:text-maroon"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
