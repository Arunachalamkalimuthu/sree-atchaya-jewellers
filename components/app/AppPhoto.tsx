"use client";
import { useState } from "react";
import type { CategoryId } from "@/lib/catalog";
import { asset } from "@/lib/asset";
import { AppIcon, CATEGORY_ICON } from "./AppIcons";

/**
 * `<AppPhoto src alt kind className round?>`: a product photo on white, square unless the caller sizes it.
 * If the photo is missing (not shot yet) it shows a plain light-grey tile with the category's line icon.
 * The app's own tile, independent of the shared ProductImage.
 */
export function AppPhoto({ src, alt, kind, className = "", round = false }: { src: string; alt: string; kind: CategoryId; className?: string; round?: boolean }) {
  const [failed, setFailed] = useState(false);
  const shape = round ? "rounded-full" : "";
  if (failed || !src) {
    return (
      <div role="img" aria-label={alt} className={`grid place-items-center bg-[#F2EEE9] text-[#A39890] ${shape} ${className}`}>
        <AppIcon name={CATEGORY_ICON[kind] ?? "shop"} size={round ? 26 : 34} strokeWidth={1.2} />
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
