"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Play, X, Shield, Award, Sparkles } from "lucide-react";

export default function WhyBuySection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const benefits = [
    "Every vehicle inspected by a certified mechanic",
    "Full vehicle history report with every listing",
    "Flexible finance options for all credit types",
    "Test drive any vehicle — no pressure, no hassle",
  ];

  return (
    <section className="bg-[#0B1320] text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1C293A]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (Content matching Screenshot 3) */}
          <div className="lg:col-span-7">
            {/* Red Subtitle */}
            <div className="text-xs sm:text-sm font-black tracking-widest text-[#ED0000] uppercase mb-3">
              WATCH OUR STORY
            </div>

            {/* Headline matching Screenshot 3 */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Why Buy From New Sai Car Bazar?
            </h2>

            {/* Paragraph */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              Thousands of happy buyers have found their perfect car with us. We believe in honest pricing, full transparency, and a stress-free buying experience every time.
            </p>

            {/* Checklist with Red Ticks */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-red-600/20 text-[#ED0000] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-200 font-medium">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* Extra assurance chips */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-[#1E293B]">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#162032] px-3.5 py-2 rounded-lg border border-[#273549]">
                <Shield className="w-4 h-4 text-[#ED0000]" />
                <span>Zero Tampering Policy</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#162032] px-3.5 py-2 rounded-lg border border-[#273549]">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Barabanki's Most Trusted</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-[#162032] px-3.5 py-2 rounded-lg border border-[#273549]">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>7-Day Return Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Video Thumbnail with Red Play Button (Matching Screenshot 3) */}
          <div className="lg:col-span-5">
            <div 
              onClick={() => setIsVideoModalOpen(true)}
              className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer group shadow-2xl border border-slate-700/50 bg-slate-900"
            >
              {/* Supercar Image */}
              <Image
                src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80"
                alt="Why Buy from New Sai Car Bazar"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
              />

              {/* Dark subtle overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

              {/* Centered Circular Red Play Button (Screenshot 3) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Ping pulse animation */}
                  <div className="absolute -inset-2 bg-red-600/40 rounded-full animate-ping" />
                  
                  {/* Play circle */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ED0000] hover:bg-[#D10000] text-white flex items-center justify-center shadow-2xl shadow-red-900/60 transition transform group-hover:scale-110">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Caption pill */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-lg border border-slate-700/50 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">Take a virtual showroom tour</span>
                <span className="text-[11px] font-bold text-[#ED0000]">2:15 Min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-[#0F1827] rounded-2xl overflow-hidden border border-[#273549] shadow-2xl">
            <div className="p-4 border-b border-[#273549] flex items-center justify-between">
              <h3 className="font-bold text-white text-base">New Sai Car Bazar - Inspection & Showroom Tour</h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center p-8 text-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-[#ED0000]/20 text-[#ED0000] flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Virtual Showroom & Quality Walkthrough</h4>
                <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                  Visit our showroom on Lucknow-Ayodhya Road, Barabanki to inspect every vehicle in person with certified mechanics.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="tel:+918858982362"
                    className="bg-[#ED0000] text-white text-sm font-bold px-6 py-2.5 rounded-md hover:bg-[#D10000] transition"
                  >
                    Call Showroom Manager
                  </a>
                  <button
                    onClick={() => setIsVideoModalOpen(false)}
                    className="bg-slate-800 text-slate-300 text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-slate-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
