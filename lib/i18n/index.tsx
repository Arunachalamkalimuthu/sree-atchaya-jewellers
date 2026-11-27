"use client";
/**
 * Bilingual (English / Tamil) UI strings.
 *
 * - Each area owns one dictionary file in lib/i18n/dict/<area>.ts:
 *     export const area = { en: { key: "…" }, ta: { key: "…" } } satisfies Dict;
 *   lib/__tests__/i18n.test.ts checks every dictionary has identical en/ta keys and no empty strings.
 * - In a client component: `const t = useT(area); t("key")`, or `t("key", { n: 3 })` to fill `{n}`.
 * - `useLang()` returns `[lang, setLang]`. The choice is saved in localStorage "sa-lang" and mirrored
 *   on <html lang>. The server and the first client render are always "en" (no hydration mismatch);
 *   a saved "ta" applies straight after hydration.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type Lang = "en" | "ta";
export type Dict = { en: Record<string, string>; ta: Record<string, string> };

const KEY = "sa-lang";
const EVENT = "sa-lang-change";

function readLang(): Lang {
  try { return window.localStorage.getItem(KEY) === "ta" ? "ta" : "en"; } catch { return "en"; }
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY || e.key === null) cb(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, cb);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(EVENT, cb); };
}

let memoryLang: Lang | null = null; // used when storage is blocked (private mode)
const getSnapshot = (): Lang => memoryLang ?? readLang();
const getServerSnapshot = (): Lang => "en";

const Ctx = createContext<[Lang, (l: Lang) => void] | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = useCallback((l: Lang) => {
    try { window.localStorage.setItem(KEY, l); memoryLang = null; } catch { memoryLang = l; }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  useEffect(() => { document.documentElement.lang = lang === "ta" ? "ta" : "en"; }, [lang]);

  const value = useMemo<[Lang, (l: Lang) => void]>(() => [lang, setLang], [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** `[lang, setLang]`. Outside a provider it is read-only English (useful in isolated previews). */
export function useLang(): [Lang, (l: Lang) => void] {
  return useContext(Ctx) ?? FALLBACK;
}
const FALLBACK: [Lang, (l: Lang) => void] = ["en", () => {}];

/** Translator for one dictionary. Unknown keys fall back to English, then to the key itself. */
export function useT<D extends Dict>(dict: D): (key: keyof D["en"], vars?: Record<string, string | number>) => string {
  const [lang] = useLang();
  return useCallback(
    (key: keyof D["en"], vars?: Record<string, string | number>) => {
      const k = key as string;
      const s = dict[lang][k] ?? dict.en[k] ?? k;
      return vars ? s.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m)) : s;
    },
    [dict, lang],
  );
}

/** Pick the right half of a `{ en, ta }` pair (product names, categories). */
export function useL10n(): <T>(v: { en: T; ta: T }) => T {
  const [lang] = useLang();
  return useCallback(<T,>(v: { en: T; ta: T }) => v[lang], [lang]);
}

const MONTHS: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ta: ["ஜன.", "பிப்.", "மார்ச்", "ஏப்.", "மே", "ஜூன்", "ஜூலை", "ஆக.", "செப்.", "அக்.", "நவ.", "டிச."],
};

/** "2026-11-26" → "26 Nov 2026" / "26 நவ. 2026". Pure string formatting: never reads the clock or time zone. */
export function formatDate(iso: string, lang: Lang, opts: { year?: boolean } = {}): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const parts = [String(d), MONTHS[lang][m - 1]];
  if (opts.year !== false) parts.push(String(y));
  return parts.join(" ");
}

/** "10:00 AM" → "10:00 AM" / "காலை 10:00". */
export function formatTime(t: string, lang: Lang): string {
  if (lang === "en") return t;
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t.trim());
  if (!m) return t;
  const h = Number(m[1]) % 12 + (m[3].toUpperCase() === "PM" ? 12 : 0);
  const part = h < 12 ? "காலை" : h < 16 ? "மதியம்" : h < 19 ? "மாலை" : "இரவு";
  return `${part} ${m[1]}:${m[2]}`;
}
