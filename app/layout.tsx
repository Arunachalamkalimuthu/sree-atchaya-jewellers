import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Mukta_Malar, Noto_Serif_Tamil } from "next/font/google";
import { DemoRibbon } from "@/components/brand/DemoRibbon";
import { DemoProvider } from "@/lib/use-demo";
import { LanguageProvider } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import { BRAND_IMAGES, hasImage } from "@/lib/images";
import "./globals.css";

// Display: Cormorant Garamond (rates, prices, headings); its Tamil glyphs fall through to Noto Serif Tamil.
// Body and UI: Mukta Malar, drawn for Tamil and Latin together.
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"] });
const mukta = Mukta_Malar({ variable: "--font-mukta", subsets: ["latin", "tamil"], weight: ["300", "400", "500", "600", "700"] });
const notoSerifTamil = Noto_Serif_Tamil({ variable: "--font-noto-serif-tamil", subsets: ["tamil"], weight: ["500", "600", "700"] });

const DESCRIPTION = "Design preview of a website and app for Sree Atchaya Jewellers, Coimbatore. Not the official website.";

export const metadata: Metadata = {
  // Pages host; asset() adds the base path, so og:image resolves to the deployed file.
  metadataBase: new URL("https://arunachalamkalimuthu.github.io"),
  title: { default: "Sree Atchaya Jewellers — design preview", template: "%s · Sree Atchaya Jewellers" },
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: "Sree Atchaya Jewellers — design preview",
    description: DESCRIPTION,
    type: "website",
    ...(hasImage(BRAND_IMAGES.og) && { images: [{ url: asset(BRAND_IMAGES.og), width: 1200, height: 630, alt: "Sree Atchaya Jewellers" }] }),
  },
  ...(hasImage(BRAND_IMAGES.icon192) && {
    icons: { icon: [{ url: asset(BRAND_IMAGES.icon192), sizes: "192x192" }, { url: asset(BRAND_IMAGES.icon512), sizes: "512x512" }], apple: asset(BRAND_IMAGES.icon192) },
  }),
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
