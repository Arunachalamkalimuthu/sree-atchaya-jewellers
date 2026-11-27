import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Mukta_Malar, Noto_Serif_Tamil } from "next/font/google";
import { DemoRibbon } from "@/components/brand/DemoRibbon";
import { DemoProvider } from "@/lib/use-demo";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

// Display: Cormorant Garamond (rates, prices, headings); its Tamil glyphs fall through to Noto Serif Tamil.
// Body and UI: Mukta Malar, drawn for Tamil and Latin together.
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"] });
const mukta = Mukta_Malar({ variable: "--font-mukta", subsets: ["latin", "tamil"], weight: ["300", "400", "500", "600", "700"] });
const notoSerifTamil = Noto_Serif_Tamil({ variable: "--font-noto-serif-tamil", subsets: ["tamil"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: { default: "Sree Atchaya Jewellers — design preview", template: "%s · Sree Atchaya Jewellers" },
  description: "Design preview of a website and app for Sree Atchaya Jewellers, Coimbatore. Not the official website.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#4a0d0f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${mukta.variable} ${notoSerifTamil.variable} h-full antialiased`}>
      <body className="min-h-full">
        <LanguageProvider>
          <DemoProvider>
            <DemoRibbon />
            {children}
          </DemoProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
