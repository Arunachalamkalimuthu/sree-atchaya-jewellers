"use client";
/**
 * Small app-only store in localStorage "sa-app": nominee, a saved address and locally approved designs.
 * The shared demo state (lib/demo-state.ts) has no fields or actions for these, so the app keeps them itself;
 * the website does not see them. See the Task 10 report.
 */
import { useCallback, useSyncExternalStore } from "react";

export interface AppLocal {
  nominee?: { name: string; relation: string };
  address?: { line: string; city: string; pin: string };
  /** Order ids whose design the customer approved in the app. */
  approved: string[];
}

const KEY = "sa-app";
const EVENT = "sa-app-change";
const EMPTY: AppLocal = { approved: [] };

let cacheRaw: string | null = null;
let cacheVal: AppLocal = EMPTY;
let memory: AppLocal | null = null; // used when storage is blocked (private mode)

function read(): AppLocal {
  if (memory) return memory;
  let raw: string | null = null;
  try { raw = window.localStorage.getItem(KEY); } catch { /* blocked */ }
  if (raw === cacheRaw) return cacheVal;
  cacheRaw = raw;
  try {
    const v = raw ? JSON.parse(raw) : null;
    cacheVal = v && typeof v === "object" && Array.isArray(v.approved) ? (v as AppLocal) : EMPTY;
  } catch { cacheVal = EMPTY; }
  return cacheVal;
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY || e.key === null) cb(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, cb);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(EVENT, cb); };
}

export function useAppLocal(): [AppLocal, (patch: Partial<AppLocal>) => void] {
  const value = useSyncExternalStore(subscribe, read, () => EMPTY);
  const update = useCallback((patch: Partial<AppLocal>) => {
    const next = { ...read(), ...patch };
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); memory = null; } catch { memory = next; }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [value, update];
}
