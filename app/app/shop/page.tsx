import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopScreen } from "@/components/app/ShopScreen";

export const metadata: Metadata = { title: "App shop" };

/** The category comes from ?c= (useSearchParams), so the screen sits inside Suspense for the static export. */
export default function AppShop() {
  return (
    <Suspense fallback={null}>
      <ShopScreen />
    </Suspense>
  );
}
