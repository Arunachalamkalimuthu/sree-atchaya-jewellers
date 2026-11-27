import { Suspense } from "react";
import type { Metadata } from "next";
import { SchemeScreen } from "@/components/app/SchemeScreen";

export const metadata: Metadata = { title: "App gold scheme" };

export default function AppScheme() {
  return (
    <Suspense fallback={null}>
      <SchemeScreen />
    </Suspense>
  );
}
