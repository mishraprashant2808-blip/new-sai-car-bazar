import type { Metadata } from "next";
import "./globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "New Sai Car Bazar | Certified Pre-Owned Cars in Barabanki, UP",
  description: "Browse thoroughly inspected quality used cars at New Sai Car Bazar, Barabanki. Transparent pricing, full vehicle history, flexible low-rate finance, and instant WhatsApp support.",
  keywords: ["Used Cars Barabanki", "Second Hand Car Barabanki", "New Sai Car Bazar", "Buy Used Car Lucknow UP", "Pre Owned Car Loan"],
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
      <body className="antialiased bg-[#0F172A] text-white">
        <WishlistProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </WishlistProvider>
      </body>
    </html>
  );
}
