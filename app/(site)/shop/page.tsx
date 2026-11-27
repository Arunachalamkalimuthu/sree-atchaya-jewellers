import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogue, CatalogueFallback } from "@/components/shop/Catalogue";

export const metadata: Metadata = { title: "Jewellery" };

/** /shop/?c=<category>&purity=&w=&sort=. One static page; the query lives in the URL (router.replace). */
export default function ShopPage() {
  return (
    <Suspense fallback={<CatalogueFallback />}>
      <Catalogue />
    </Suspense>
  );
}
