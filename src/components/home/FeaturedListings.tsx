"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Vehicle } from "@/types";
import VehicleCard from "../ui/VehicleCard";

interface FeaturedListingsProps {
  vehicles: Vehicle[];
}

export default function FeaturedListings({ vehicles }: FeaturedListingsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'new' | 'hot'>('all');

  const filteredVehicles = vehicles.filter((v) => {
    if (activeTab === 'featured') return v.is_featured;
    if (activeTab === 'new') return v.is_new_arrival;
    if (activeTab === 'hot') return v.is_hot_deal;
    return true;
  });

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header matching Screenshot 2 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
              FEATURED LISTINGS
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Hand-picked certified vehicles ready for immediate delivery in Barabanki
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Filter Tabs */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'featured' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'new' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab('hot')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'hot' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Hot Deals
              </button>
            </div>

            {/* Red View All Link matching Screenshot 2 */}
            <Link
              href="/inventory"
              className="text-[#ED0000] hover:text-[#D10000] font-bold text-sm sm:text-base flex items-center gap-1 group transition"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVehicles.slice(0, 6).map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
