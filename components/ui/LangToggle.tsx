"use client";
import { useLang, useT, type Lang } from "@/lib/i18n";
import { common } from "@/lib/i18n/dict/common";

const OPTIONS: { id: Lang; label: string; lang: string }[] = [
  { id: "en", label: "English", lang: "en" },
  { id: "ta", label: "தமிழ்", lang: "ta" },
];

/**
 * English / தமிழ் switch. `tone="dark"` on maroon grounds (header, drawer), `"light"` on ivory.
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
          dark ? "border-gold/45 text-gold-light hover:bg-gold/10" : "border-maroon/25 text-maroon hover:bg-maroon/5"
        } ${className}`}
      >
        {other.id === "en" ? "EN" : other.label}
      </button>
    );
  }
  return (
    <div role="group" aria-label={t("language")} className={`inline-flex rounded-full border p-0.5 ${dark ? "border-gold/45" : "border-maroon/25"} ${className}`}>
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
                ? dark ? "bg-gold text-maroon-deep" : "bg-maroon text-ivory"
                : dark ? "text-ivory/80 hover:text-gold-light" : "text-maroon/75 hover:text-maroon"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
