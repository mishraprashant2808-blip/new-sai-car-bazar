import { MetadataRoute } from "next";
import { DataStore } from "@/lib/data/store";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://new-sai-car-bazar.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Static Public Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/inventory`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sell-my-car`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/finance`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic Vehicle Listings from Supabase or DataStore
  let vehicles = [];
  try {
    vehicles = await DataStore.fetchVehiclesLive();
  } catch {
    vehicles = DataStore.getVehicles();
  }

  const vehicleRoutes: MetadataRoute.Sitemap = (vehicles || []).map((vehicle) => ({
    url: `${BASE_URL}/inventory/${vehicle.slug}`,
    lastModified: vehicle.updated_at || vehicle.created_at || currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
