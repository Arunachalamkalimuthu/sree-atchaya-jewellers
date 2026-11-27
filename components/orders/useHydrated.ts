"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False on the server and during hydration, true afterwards. Stops saved cart/order state flashing as "empty". */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
