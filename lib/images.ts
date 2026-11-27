/** Which photos exist (from the generated lib/image-manifest.ts) and where the banners live. */
import { IMAGE_MANIFEST } from "./image-manifest";

const FILES = new Set(IMAGE_MANIFEST);

/** True when `src` (a /images/... path, before asset()) is a file in public/images. */
export function hasImage(src: string | undefined | null): boolean {
  return !!src && FILES.has(src.split(/[?#]/)[0]);
}

/** Wide banner photos (1920×1080). Missing ones render as a warm off-white panel (see components/ui/Banner). */
export const BANNERS = {
  bridal: "/images/banners/hero-bridal.jpg",
  prebook: "/images/banners/hero-prebook.jpg",
  coins: "/images/banners/hero-coins.jpg",
  oldgold: "/images/banners/hero-oldgold.jpg",
  showroom: "/images/banners/showroom.jpg",
  scheme: "/images/banners/scheme.jpg",
} as const;

export const BRAND_IMAGES = {
  mark: "/images/brand/mark.png",
  icon192: "/images/brand/icon-192.png",
  icon512: "/images/brand/icon-512.png",
  og: "/images/brand/og.jpg",
} as const;
