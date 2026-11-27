import type { Metadata } from "next";
import { CustomWizard } from "@/components/custom/CustomWizard";

export const metadata: Metadata = { title: "Pre-book a custom design" };

export default function CustomOrderPage() {
  return <CustomWizard />;
}
