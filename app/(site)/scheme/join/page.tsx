import { Suspense } from "react";
import { JoinFlow } from "@/components/scheme/JoinFlow";

export const metadata = { title: "Join the gold savings scheme" };

export default function SchemeJoinPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <JoinFlow />
    </Suspense>
  );
}
