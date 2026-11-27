import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryBar } from "@/components/home/CategoryBar";
import { NewArrivals, TempleBridal } from "@/components/home/HomeRows";
import { PromoPair } from "@/components/home/PromoPair";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CoinBand } from "@/components/home/CoinBand";
import { ContestCards } from "@/components/home/ContestCards";
import { InstagramStrip } from "@/components/home/InstagramStrip";
import { VisitUs } from "@/components/home/VisitUs";

/**
 * Home (design v2, "premium retailer"): photo banner slider, round category thumbnails, new arrivals, the two promo
 * banners, temple and bridal, the trust strip, gold coins, contests, the Instagram strip and Visit us (#visit).
 * Today's rates live in the ticker above the header.
 */
export default function Home() {
  return (
    <>
      <HeroSlider />
      <CategoryBar />
      <NewArrivals />
      <PromoPair />
      <TempleBridal />
      <TrustStrip />
      <CoinBand />
      <ContestCards />
      <InstagramStrip />
      <VisitUs />
    </>
  );
}
