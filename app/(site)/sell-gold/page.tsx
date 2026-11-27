import type { Metadata } from "next";
import { SellGold } from "@/components/sell/SellGold";

export const metadata: Metadata = { title: "Sell old gold or release pledged gold" };

export default function SellGoldPage() {
  return <SellGold />;
}
