"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const phone = process.env.NEXT_PUBLIC_DEALER_WHATSAPP || "+919876543210";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const message = encodeURIComponent("Hello New Sai Car Bazar, I am interested in viewing your available cars.");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-green-400/30"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-semibold text-sm pl-0 group-hover:pl-2 text-white">
        WhatsApp Us
      </span>
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0F172A]"></span>
      </span>
    </a>
  );
}
