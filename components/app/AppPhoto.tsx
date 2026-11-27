"use client";
import { useState } from "react";
import type { CategoryId } from "@/lib/catalog";
import { asset } from "@/lib/asset";
import { AppIcon, CATEGORY_ICON } from "./AppIcons";
import { useHasPhoto } from "./photos";

/**
 * `<AppPhoto src alt kind className round?>`: a product photo on white, square unless the caller sizes it.
 * Banner paths (/images/banners/) are always requested; product photos only when the build found the file
 * (see photos.tsx). A missing photo is a plain light-grey tile with the category's line icon.
 * The app's own tile, independent of the shared ProductImage.
 */
export function AppPhoto({ src, alt, kind, className = "", round = false, iconSize }: { src: string; alt: string; kind: CategoryId; className?: string; round?: boolean; iconSize?: number }) {
  const has = useHasPhoto();
  const [failed, setFailed] = useState(false);
  const shape = round ? "rounded-full" : "";
  const known = !!src && (src.startsWith("/images/banners/") || has(src));
  if (failed || !known) {
    return (
      <div role="img" aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={`grid place-items-center bg-[#F2EEE9] text-[#A39890] ${shape} ${className}`}>
        <AppIcon name={CATEGORY_ICON[kind] ?? "shop"} size={iconSize ?? (round ? 26 : 34)} strokeWidth={1.2} />
      </div>
    );
  }
  return (
    <div className={`overflow-hidden bg-white ${shape} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(src)} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className="size-full object-cover" />
    </div>
  );
}
