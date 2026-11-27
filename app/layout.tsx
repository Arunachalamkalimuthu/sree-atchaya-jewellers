import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Noto_Sans_Tamil } from "next/font/google";
import { DemoRibbon } from "@/components/brand/DemoRibbon";
import "./globals.css";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const notoTamil = Noto_Sans_Tamil({ variable: "--font-noto-tamil", subsets: ["tamil"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: { default: "Sree Atchaya Jewellers — design preview", template: "%s · Sree Atchaya Jewellers" },
  description: "Design preview of a website and app for Sree Atchaya Jewellers, Coimbatore. Not the official website.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#4a0d0f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${notoTamil.variable} h-full antialiased`}>
      <body className="min-h-full">
        <DemoRibbon />
        {children}
      </body>
    </html>
  );
}
