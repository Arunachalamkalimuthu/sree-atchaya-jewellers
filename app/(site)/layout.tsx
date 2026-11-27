import { RateBar } from "@/components/site/RateBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

/** Website chrome. The /app/* phone screens live outside this group and get none of it. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RateBar compact />
      <Header />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
