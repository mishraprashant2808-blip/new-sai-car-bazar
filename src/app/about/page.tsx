"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, Phone, MapPin, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#0A0F1D] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block text-xs font-black tracking-widest text-[#ED0000] uppercase bg-red-600/10 border border-red-600/20 px-3 py-1 rounded-full">
              ABOUT NEW SAI CAR BAZAR
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Redefining Used Car Buying in Barabanki & Uttar Pradesh
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Founded on the pillars of honesty, uncompromised vehicle quality, and complete transparency, New Sai Car Bazar has grown to become the premier certified pre-owned automotive dealership in Barabanki.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every single automobile on our showroom floor undergoes a thorough 150-point technical inspection by certified mechanics. From verifying non-accidental chassis integrity to rigorous engine health testing and computerized diagnostic scans, we guarantee peace of mind with zero hidden surprises.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/inventory"
                className="bg-[#ED0000] hover:bg-[#D10000] text-white font-bold px-7 py-3 rounded-lg text-sm transition flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
              >
                <span>View Our Stock</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="bg-[#162032] hover:bg-[#1E293B] text-slate-200 border border-[#273549] font-bold px-7 py-3 rounded-lg text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>Visit Showroom</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80"
                alt="New Sai Car Bazar Showroom"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700">
                <div className="text-xs text-[#ED0000] font-black uppercase tracking-wider">Showroom Location</div>
                <div className="font-bold text-sm text-white">Lucknow-Ayodhya Road, Barabanki (UP)</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Trust */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">The New Sai Car Bazar Promise</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Why thousands of families and professionals in Uttar Pradesh choose us for their car purchase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#121B2A] border border-[#273549] p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 text-[#ED0000] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">150-Point Certified Check</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Comprehensive physical and mechanical audit covering brakes, suspension, powertrain, electrical systems, air conditioning, and safety equipment.
              </p>
            </div>

            <div className="bg-[#121B2A] border border-[#273549] p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100% Genuine Odometer</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Strict zero-tampering policy verified through OEM service records. What you see on the dashboard is 100% authenticated history.
              </p>
            </div>

            <div className="bg-[#121B2A] border border-[#273549] p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hassle-Free RC Transfer</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Complete paperwork facilitation, RTO clearances, ownership transfer tracking, and immediate insurance renewal assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
