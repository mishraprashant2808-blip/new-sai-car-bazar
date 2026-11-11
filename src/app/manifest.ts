import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/?source=pwa",
    name: "New Sai Car Bazar | Certified Pre-Owned Cars",
    short_name: "Sai Car Bazar",
    description: "Browse certified quality used cars with 150-point inspection, EMI calculator and instant car loan financing in Barabanki and Lucknow, UP.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0F172A",
    theme_color: "#ED0000",
    lang: "en-IN",
    dir: "ltr",
    categories: ["shopping", "automotive", "business"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Browse Inventory",
        short_name: "Inventory",
        description: "Browse verified used cars with prices and specs",
        url: "/inventory?source=pwa_shortcut",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Sell Your Car",
        short_name: "Sell Car",
        description: "Get free doorstep valuation and instant payment",
        url: "/sell-my-car?source=pwa_shortcut",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "EMI & Finance Calculator",
        short_name: "Finance",
        description: "Calculate monthly EMI and apply for used car loan",
        url: "/finance?source=pwa_shortcut",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
