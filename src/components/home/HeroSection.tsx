"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#0A0F1D]">
      {/* Background Cinematic Automotive Image with Dark Navy Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        {/* Navy Gradient Overlay for high-contrast text matching Screenshot 1 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1827]/95 via-[#0F1827]/85 to-[#0F1827]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1827] via-transparent to-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          {/* Red Subtitle */}
          <div className="inline-block mb-3">
            <span className="text-xs sm:text-sm font-extrabold tracking-widest text-[#ED0000] uppercase drop-shadow-sm">
              QUALITY ASSURED — CERTIFIED PRE-OWNED
            </span>
          </div>

          {/* Headline (Matching Screenshot 1) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.08] mb-6 drop-shadow-md">
            FIND YOUR PERFECT <br />
            <span className="text-white">USED CAR</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl drop-shadow">
            Browse thoroughly inspected used vehicles. Transparent pricing, full vehicle history, and flexible finance options in Barabanki.
          </p>

          {/* CTA Buttons (Matching Screenshot 1: Red Browse Inventory & White Finance Calculator) */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <Link
              href="/inventory"
              className="bg-[#ED0000] hover:bg-[#D10000] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-md shadow-lg shadow-red-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/finance"
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-base px-8 py-4 rounded-md shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-slate-700" />
              <span>Finance Calculator</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 pt-8 border-t border-slate-700/50 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">150+</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Point Inspection</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#ED0000]">100%</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Verified RC</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">9.5%</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Starting EMI</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
