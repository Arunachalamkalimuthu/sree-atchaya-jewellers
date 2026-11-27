"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useSyncExternalStore, type ReactNode } from "react";
import { initialState, load, reduce, type Action, type DemoState } from "./demo-state";

const KEY = "sa-demo";

interface Snap { state: DemoState; lastOrderId: string | null }
interface Ctx extends Snap { dispatch(a: Action): void }

const serverSnap: Snap = { state: initialState, lastOrderId: null };
const Context = createContext<Ctx | null>(null);

function readStorage(): string | null {
  try { return window.localStorage.getItem(KEY); } catch { return null; }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const snapRef = useRef<Snap>(serverSnap);
  const listeners = useRef(new Set<() => void>());
  const emit = () => listeners.current.forEach((l) => l());

  const subscribe = useCallback((cb: () => void) => {
    listeners.current.add(cb);
    // First client subscription: hydrate from storage (the server/hydration snapshot is initialState).
    if (snapRef.current === serverSnap) snapRef.current = { state: load(readStorage()), lastOrderId: null };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY && e.key !== null) return;
      snapRef.current = { ...snapRef.current, state: load(e.newValue) };
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => { listeners.current.delete(cb); window.removeEventListener("storage", onStorage); };
  }, []);

  const snap = useSyncExternalStore(subscribe, () => snapRef.current, () => serverSnap);

  const dispatch = useCallback((a: Action) => {
    const prev = snapRef.current;
    const stamped: Action = { ...a, now: a.now ?? new Date().toISOString().slice(0, 10) };
    const state = reduce(prev.state, stamped);
    const lastOrderId = a.type === "placeOrder" && state !== prev.state ? state.orders.at(-1)!.id : prev.lastOrderId;
    snapRef.current = { state, lastOrderId };
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota / private mode */ }
    emit();
  }, []);


  const value = useMemo<Ctx>(() => ({ ...snap, dispatch }), [snap, dispatch]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useDemo(): { state: DemoState; dispatch(a: Action): void; lastOrderId: string | null } {
  const c = useContext(Context);
  if (!c) throw new Error("useDemo must be used inside <DemoProvider>");
  return c;
}
