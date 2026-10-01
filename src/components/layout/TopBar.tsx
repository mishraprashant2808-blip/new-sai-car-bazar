"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, HelpCircle, Calculator } from "lucide-react";
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

        {/* Right: Quick Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/finance"
            className="flex items-center gap-1 hover:text-white/90 transition-opacity"
          >
            <Calculator className="w-3.5 h-3.5 hidden sm:inline" />
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
