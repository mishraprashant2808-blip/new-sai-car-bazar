import React from "react";
import HeroSection from "@/components/home/HeroSection";
import BrowseByMake from "@/components/home/BrowseByMake";
import FeaturedListings from "@/components/home/FeaturedListings";
import WhyBuySection from "@/components/home/WhyBuySection";
import LeadershipSection from "@/components/about/LeadershipSection";
import { DataStore } from "@/lib/data/store";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const makes = await DataStore.fetchMakesLive();
  const vehicles = await DataStore.fetchVehiclesLive();

  const autoDealerJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": "https://new-sai-car-bazar.vercel.app/#dealership",
    "name": "New Sai Car Bazar",
    "alternateName": "New Sai Car Bazar Barabanki",
    "description": "Certified pre-owned and quality used cars dealership in Barabanki and Lucknow, Uttar Pradesh. 150-point inspection, instant car loan financing, exchange options, and RC transfer support.",
    "url": "https://new-sai-car-bazar.vercel.app",
    "telephone": "+91-8858982362",
    "priceRange": "₹₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Bank Transfer, Car Loan, UPI",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Near Railway Crossing, Lucknow-Ayodhya Road",
      "addressLocality": "Barabanki",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "225001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.9274,
      "longitude": 81.1834
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:30",
        "closes": "20:30"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Barabanki" },
      { "@type": "City", "name": "Lucknow" },
      { "@type": "City", "name": "Ayodhya" },
      { "@type": "City", "name": "Faizabad" },
      { "@type": "AdministrativeArea", "name": "Uttar Pradesh" }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "142",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <div>
      {/* Schema.org AutoDealer Rich Snippet for Google Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerJsonLd) }}
      />
      <HeroSection />
      <BrowseByMake makes={makes} />
      <FeaturedListings vehicles={vehicles} />
      <WhyBuySection />
      <div className="bg-[#070B14] border-t border-[#1C293A] px-4 sm:px-6 lg:px-8">
        <LeadershipSection />
      </div>
    </div>
  );
}
