import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import AppLayout from "@/components/layout/AppLayout";
import Analytics from "@/components/common/Analytics";

export const viewport: Viewport = {
  themeColor: "#ED0000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "New Sai Car Bazar | Certified Pre-Owned Cars in Barabanki, UP",
  description: "Browse thoroughly inspected quality used cars at New Sai Car Bazar, Barabanki. Transparent pricing, full vehicle history, flexible low-rate finance, and instant WhatsApp support.",
  keywords: ["Used Cars Barabanki", "Second Hand Car Barabanki", "New Sai Car Bazar", "Buy Used Car Lucknow UP", "Pre Owned Car Loan"],
  manifest: "/manifest.webmanifest",
  applicationName: "Sai Car Bazar",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icon.svg",
        color: "#ED0000",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sai Car Bazar",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#0F172A",
    "msapplication-tap-highlight": "no",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "de7ac1acede14736",
  },
  openGraph: {
    title: "New Sai Car Bazar | Quality Assured Used Cars in Barabanki",
    description: "Find your perfect certified pre-owned car with 150-point inspection and transparent pricing.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sai Car Bazar" />
      </head>
      <body className="antialiased bg-[#0F172A] text-white">
        <WishlistProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </WishlistProvider>
        <Analytics />
      </body>
    </html>
  );
}
