import type { Metadata } from "next";
import { OrdersScreen } from "@/components/app/OrdersScreen";

export const metadata: Metadata = { title: "App orders" };

export default function AppOrders() {
  return <OrdersScreen />;
}
