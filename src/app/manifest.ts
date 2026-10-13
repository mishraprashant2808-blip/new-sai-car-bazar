import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "New Sai Car Bazar | Certified Pre-Owned Cars",
    short_name: "Sai Car Bazar",
    description: "Browse certified quality used cars with 150-point inspection and easy low-rate finance in Barabanki and Lucknow, UP.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0F1D",
    theme_color: "#ED0000",
    orientation: "portrait",
    categories: ["shopping", "automotive", "business"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
