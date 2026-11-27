import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderScreen } from "@/components/app/OrderScreen";

export const metadata: Metadata = { title: "App order" };

/** Orders are created in the browser, so the id comes from ?id= (static export). */
export default function AppOrder() {
  return (
    <Suspense fallback={null}>
      <OrderScreen />
    </Suspense>
  );
}
