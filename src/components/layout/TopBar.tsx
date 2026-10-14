"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, HelpCircle, Calculator, Instagram } from "lucide-react";
import { createPhoneCallUrl } from "@/lib/utils";

export default function TopBar() {
  const phone = "8858982362";
  const email = "mishraprashant2808@gmail.com";

  return (
    <div className="bg-[#ED0000] text-white text-xs md:text-sm font-medium py-2 px-4 sm:px-6 lg:px-8 border-b border-red-700/30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2">
        {/* Left: Phone & Email */}
        <div className="flex items-center space-x-6">
          <a
            href={createPhoneCallUrl(phone)}
            className="flex items-center gap-1.5 hover:text-white/90 transition-opacity"
            title="Call New Sai Car Bazar"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{phone}</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 hover:text-white/90 transition-opacity"
            title="Email New Sai Car Bazar"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{email}</span>
            <span className="sm:hidden">Email</span>
          </a>
        </div>

        {/* Right: Instagram & Quick Links */}
        <div className="flex items-center space-x-5">
          <a
            href="https://www.instagram.com/sai_car_deals/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-black/20 hover:bg-black/35 px-2.5 py-0.5 rounded-full text-xs font-bold transition"
            title="Follow New Sai Car Bazar on Instagram"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-200" />
            <span>@sai_car_deals</span>
          </a>
          <Link
            href="/finance"
            className="flex items-center gap-1 hover:text-white/90 transition-opacity hidden md:flex"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Finance Calculator</span>
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-1 hover:text-white/90 transition-opacity"
          >
            <HelpCircle className="w-3.5 h-3.5 hidden sm:inline" />
            <span>Help</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
