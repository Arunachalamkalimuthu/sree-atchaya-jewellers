import type { Metadata } from "next";
import { ProfileScreen } from "@/components/app/ProfileScreen";

export const metadata: Metadata = { title: "App profile" };

export default function AppProfile() {
  return <ProfileScreen />;
}
