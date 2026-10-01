"use client";

import React from "react";
import Link from "next/link";
import { Car } from "lucide-react";
import { Make } from "@/types";

interface BrowseByMakeProps {
  makes: Make[];
}

export default function BrowseByMake({ makes }: BrowseByMakeProps) {
  // 10 top makes matching visual reference Screenshot 2
  const targetMakes = [
    { name: "Toyota", slug: "toyota", icon: "🚗" },
    { name: "Ford", slug: "ford", icon: "🚙" },
    { name: "Honda", slug: "honda", icon: "🚕" },
    { name: "BMW", slug: "bmw", icon: "🏎️" },
    { name: "Mercedes", slug: "mercedes", icon: "🚐" },
    { name: "Audi", slug: "audi", icon: "🚓" },
    { name: "Nissan", slug: "nissan", icon: "🚔" },
    { name: "Jeep", slug: "jeep", icon: "🚒" },
    { name: "Chevrolet", slug: "chevrolet", icon: "🚑" },
    { name: "Volkswagen", slug: "volkswagen", icon: "🚌" },
  ];

  return (
    <section id="makes" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading matching Screenshot 2 */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
            BROWSE BY MAKE
          </h2>
          <div className="w-16 h-1 bg-[#ED0000] mx-auto mt-3 rounded-full" />
        </div>

        {/* 10 Make Cards Grid matching Screenshot 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4">
          {targetMakes.map((item) => {
            return (
              <Link
                key={item.slug}
                href={`/inventory?make=${item.slug}`}
                className="group flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-xl hover:border-red-200 hover:-translate-y-1 transition duration-200 text-center cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-2.5">
                  <span>{item.icon}</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#ED0000] transition-colors">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
