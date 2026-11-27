import { RateBoard } from "@/components/site/RateBar";
import { GoldRule } from "@/components/brand/GoldRule";
import { TodaysOffers } from "@/components/home/TodaysOffers";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { NewArrivals } from "@/components/home/NewArrivals";
import { SchemeCallout } from "@/components/home/SchemeCallout";
import { ServicesStrip } from "@/components/home/ServicesStrip";
import { ContestCards } from "@/components/home/ContestCards";
import { ShowroomReels } from "@/components/home/ShowroomReels";
import { VisitUs } from "@/components/home/VisitUs";

/**
 * Home. Opens on the shop's rate board (the signature), then today's offers in their poster frames. The rest
 * follows the spec order: categories, new arrivals, scheme, services, contests, reels, visit (#visit).
 */
export default function Home() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <RateBoard />
      </div>
      <TodaysOffers />
      <Divider />
      <CategoryGrid />
      <Divider />
      <NewArrivals />
      <SchemeCallout />
      <ServicesStrip />
      <ContestCards />
      <ShowroomReels />
      <VisitUs />
    </>
  );
}

function Divider() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <GoldRule />
    </div>
  );
}
