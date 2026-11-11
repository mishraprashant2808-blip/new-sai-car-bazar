"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, DollarSign, Calculator, PhoneCall, MessageCircle, X } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [contactSheetOpen, setContactSheetOpen] = useState(false);

  // Hide bottom nav on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Inventory", href: "/inventory", icon: Car },
    { label: "Sell Car", href: "/sell-my-car", icon: DollarSign },
    { label: "Finance", href: "/finance", icon: Calculator },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F1827]/95 backdrop-blur-lg border-t border-[#1E293B] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
      >
        <div className="grid grid-cols-5 h-14 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center h-full transition relative ${
                  isActive ? "text-[#ED0000]" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-0.5 bg-[#ED0000] rounded-full shadow-[0_0_8px_#ED0000]" />
                )}
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          {/* Quick Contact Action Button */}
          <button
            type="button"
            onClick={() => setContactSheetOpen(true)}
            className="flex flex-col items-center justify-center h-full text-slate-400 hover:text-white transition cursor-pointer"
          >
            <div className="w-5 h-5 flex items-center justify-center mb-0.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-400">Contact</span>
          </button>
        </div>
      </nav>

      {/* Quick Contact Action Sheet */}
      {contactSheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#162032] border border-[#273549] text-white w-full rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <button
              onClick={() => setContactSheetOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-[#0F172A]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-white mb-1">New Sai Car Bazar</h3>
            <p className="text-xs text-slate-400 mb-5">
              Direct dealership contact for test drives, pricing & loan assistance
            </p>

            <div className="space-y-3">
              <a
                href="tel:+918858982362"
                onClick={() => setContactSheetOpen(false)}
                className="w-full bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/40"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Showroom (+91 8858982362)</span>
              </a>

              <a
                href="https://wa.me/918172946630?text=Hello%20New%20Sai%20Car%20Bazar%2C%20I%20am%20interested%20in%20certified%20used%20cars."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setContactSheetOpen(false)}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 8172946630)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setContactSheetOpen(false);
                  window.dispatchEvent(new Event("nscb-trigger-pwa-install"));
                }}
                className="w-full bg-[#0F1827] hover:bg-[#1A263A] border border-[#273549] text-slate-200 font-semibold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <span>Install Sai Car Bazar App on this Phone</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

