/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";

type Dict = { en: Record<string, string>; ta: Record<string, string> };

// Every dictionary under lib/i18n/dict is picked up, including ones added by later tasks.
const modules = import.meta.glob<Record<string, unknown>>("../i18n/dict/*.ts", { eager: true });

const dicts: [string, Dict][] = Object.entries(modules).flatMap(([file, mod]) =>
  Object.entries(mod)
    .filter(([, v]) => typeof v === "object" && v !== null && "en" in v && "ta" in v)
    .map(([name, v]) => [`${file.split("/").pop()}:${name}`, v as Dict] as [string, Dict]),
);

describe("i18n dictionaries", () => {
  it("finds at least the common dictionary", () => {
    expect(dicts.map(([n]) => n)).toContain("common.ts:common");
  });

  it.each(dicts)("%s: Tamil and English have the same keys", (_name, d) => {
    expect(Object.keys(d.ta).sort()).toEqual(Object.keys(d.en).sort());
  });

  it.each(dicts)("%s: {placeholders} match between English and Tamil", (_name, d) => {
    const names = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const k of Object.keys(d.en)) {
      expect(names(d.ta[k] ?? ""), `ta.${k}`).toEqual(names(d.en[k]));
    }
  });

  it.each(dicts)("%s: no empty strings", (_name, d) => {
    for (const lang of ["en", "ta"] as const) {
      for (const [k, v] of Object.entries(d[lang])) {
        expect(typeof v, `${lang}.${k}`).toBe("string");
        expect(v.trim(), `${lang}.${k}`).not.toBe("");
      }
    }
  });
});
