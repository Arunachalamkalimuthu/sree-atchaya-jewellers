import type { OrderStatus } from "@/lib/demo-state";

/** The checkout dictionary's tracker label key for a status (trackBooked, trackDesign_approved…). */
export const statusKey = (s: OrderStatus) =>
  `track${s[0].toUpperCase()}${s.slice(1)}` as "trackBooked" | "trackDesign_approved" | "trackMaking" | "trackHallmarked" | "trackReady";
