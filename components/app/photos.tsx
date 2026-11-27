"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";

/**
 * Which product photos exist under /public/images/products, listed by the server layout at build time.
 * AppPhoto only requests a file on this list, so unshot pieces draw their grey tile without a 404.
 * When new photos land, a rebuild picks them up; nothing to flip by hand.
 */
const PhotosCtx = createContext<ReadonlySet<string>>(new Set());

export function PhotosProvider({ photos, children }: { photos: string[]; children: ReactNode }) {
  const set = useMemo(() => new Set(photos), [photos]);
  return <PhotosCtx.Provider value={set}>{children}</PhotosCtx.Provider>;
}

/** True when `src` (a site path such as /images/products/x.jpg) is a photo that exists. */
export function useHasPhoto(): (src: string) => boolean {
  const set = useContext(PhotosCtx);
  return (src) => set.has(src);
}
