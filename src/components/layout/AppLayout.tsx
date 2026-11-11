"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import MainHeader from "./MainHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WishlistDrawer from "../wishlist/WishlistDrawer";
import FloatingWhatsApp from "../common/FloatingWhatsApp";
import MobileBottomNav from "../pwa/MobileBottomNav";
import PwaInstallPrompt from "../pwa/PwaInstallPrompt";
import ServiceWorkerRegister from "../pwa/ServiceWorkerRegister";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [wishlistOpen, setWishlistOpen] = useState(false);

  if (isAdmin) {
    // Admin routes handle their own layout
    return (
      <>
        {children}
        <ServiceWorkerRegister />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-white">
      <TopBar />
      <MainHeader onOpenWishlist={() => setWishlistOpen(true)} />
      <Navbar />
      
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      <Footer />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <FloatingWhatsApp />
      <MobileBottomNav />
      <PwaInstallPrompt />
      <ServiceWorkerRegister />
    </div>
  );
}
