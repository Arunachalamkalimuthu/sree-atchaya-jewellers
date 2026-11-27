import { Suspense } from "react";
import { OrderView } from "@/components/orders/OrderView";

/** Orders are created in the browser, so the id comes from ?id= (static export). */
export default function OrderPage() {
  return (
    <Suspense fallback={null}>
      <OrderView />
    </Suspense>
  );
}
