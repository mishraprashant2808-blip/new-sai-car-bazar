"use client";

import React from "react";
import { Instagram, Play, Sparkles, ArrowUpRight, Flame } from "lucide-react";

export default function InstagramBanner() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#090D18]">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-rose-500/30 bg-gradient-to-r from-[#141226] via-[#1A1224] to-[#1F111D] p-8 sm:p-12 shadow-2xl shadow-rose-950/20">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Info & Handle */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/15 via-rose-500/15 to-amber-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Live On Instagram</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Watch Real Car Walkarounds & Delivery Reels on{" "}
                <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
                  @sai_car_deals
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Want to see the cars in action before visiting our showroom? Follow our official Instagram page for daily 360° walkaround videos, exhaust sounds, fresh stock arrivals, and happy buyer key handovers!
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                  <Play className="w-3 h-3 text-rose-400 fill-rose-400" />
                  <span>360° Walkaround Reels</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Daily New Stock Alerts</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                  <Instagram className="w-3 h-3 text-purple-400" />
                  <span>Exclusive Deals & Stories</span>
                </div>
              </div>
            </div>

            {/* Right Column: CTA Card */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start lg:items-end justify-center">
              <a
                href="https://www.instagram.com/sai_car_deals/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-extrabold px-8 py-4 rounded-2xl text-base shadow-xl shadow-rose-900/40 transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <span>Follow @sai_car_deals</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                Official Instagram of New Sai Car Bazar
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
