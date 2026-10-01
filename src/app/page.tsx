import React from "react";
import HeroSection from "@/components/home/HeroSection";
import BrowseByMake from "@/components/home/BrowseByMake";
import FeaturedListings from "@/components/home/FeaturedListings";
import WhyBuySection from "@/components/home/WhyBuySection";
import { DataStore } from "@/lib/data/store";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const makes = await DataStore.fetchMakesLive();
  const vehicles = await DataStore.fetchVehiclesLive();

  return (
    <div>
      <HeroSection />
      <BrowseByMake makes={makes} />
      <FeaturedListings vehicles={vehicles} />
      <WhyBuySection />
    </div>
  );
}
