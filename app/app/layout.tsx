import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { Metadata, Viewport } from "next";
import { asset } from "@/lib/asset";
import { AppShell } from "@/components/app/AppShell";
import { APP_PUBLIC_URL } from "@/components/app/app-url";
import { qrPath } from "@/components/app/qr";

export const metadata: Metadata = {
  title: "App",
  manifest: asset("/manifest.webmanifest"),
  icons: { icon: asset("/images/brand/icon-192.png"), apple: asset("/images/brand/icon-192.png") },
  appleWebApp: { capable: true, title: "Atchaya", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#6E1517" };

// Made once at build time; the panel only draws the path.
const qr = qrPath(APP_PUBLIC_URL);

// The product photos that exist, so the app never requests one that is not shot yet.
function productPhotos(): string[] {
  try {
    return readdirSync(join(process.cwd(), "public/images/products"))
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .map((f) => `/images/products/${f}`);
  } catch {
    return [];
  }
}
const photos = productPhotos();

/**
 * The mobile app. No website header or footer here (those live in app/(site)/layout.tsx).
 * AppShell decides per viewport: the app full-screen (phones, and inside the desktop iframe), or the phone frame
 * with the QR panel (desktop).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell qr={qr} photos={photos}>{children}</AppShell>;
}
