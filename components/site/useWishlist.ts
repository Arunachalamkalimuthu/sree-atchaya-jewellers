"use client";
import { useCallback, useSyncExternalStore } from "react";

/** Saved pieces, by slug, in localStorage "sa-wish". Local only: nothing else reads it yet. */
const KEY = "sa-wish";
const EVENT = "sa-wish-change";
const EMPTY: readonly string[] = [];

let cacheRaw: string | null = null;
let cacheList: readonly string[] = EMPTY;

function read(): readonly string[] {
  let raw: string | null = null;
  try { raw = window.localStorage.getItem(KEY); } catch { return cacheList; }
  if (raw === cacheRaw) return cacheList;
  cacheRaw = raw;
  try {
    const v: unknown = raw ? JSON.parse(raw) : [];
    cacheList = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : EMPTY;
  } catch { cacheList = EMPTY; }
  return cacheList;
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY || e.key === null) cb(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, cb);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(EVENT, cb); };
}

/** `{ has(slug), toggle(slug) }`. Server and first render: empty (no hydration mismatch). */
export function useWishlist() {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((slug: string) => {
    const cur = read();
    const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { cacheRaw = "\u0000"; cacheList = next; }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  const has = useCallback((slug: string) => list.includes(slug), [list]);
  return { has, toggle, count: list.length };
}
