"use client";

import React from "react";
import Link from "next/link";
import { Make } from "@/types";
import {
  MarutiSuzukiLogo,
  HyundaiLogo,
  TataLogo,
  MahindraLogo,
  KiaLogo,
  ToyotaLogo,
  HondaLogo,
  RenaultLogo,
  VolkswagenLogo,
  FordLogo,
} from "@/components/icons/BrandLogos";

interface BrowseByMakeProps {
  makes: Make[];
}

export default function BrowseByMake({ makes }: BrowseByMakeProps) {
  // Top 10 Indian market makes - non-premium popular brands
  const targetMakes = [
    { name: "Maruti Suzuki", slug: "maruti-suzuki", Logo: MarutiSuzukiLogo },
    { name: "Hyundai", slug: "hyundai", Logo: HyundaiLogo },
    { name: "Tata", slug: "tata", Logo: TataLogo },
    { name: "Mahindra", slug: "mahindra", Logo: MahindraLogo },
    { name: "Kia", slug: "kia", Logo: KiaLogo },
    { name: "Toyota", slug: "toyota", Logo: ToyotaLogo },
    { name: "Honda", slug: "honda", Logo: HondaLogo },
    { name: "Renault", slug: "renault", Logo: RenaultLogo },
    { name: "Volkswagen", slug: "volkswagen", Logo: VolkswagenLogo },
    { name: "Ford", slug: "ford", Logo: FordLogo },
  ];

  return (
    <section id="makes" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
            BROWSE BY MAKE
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Explore trusted certified vehicles from top Indian & global manufacturers
          </p>
          <div className="w-16 h-1 bg-[#ED0000] mx-auto mt-3 rounded-full" />
        </div>

        {/* 10 Make Cards Grid with Original Brand Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4">
          {targetMakes.map((item) => {
            const LogoComponent = item.Logo;
            return (
              <Link
                key={item.slug}
                href={`/inventory?make=${item.slug}`}
                className="group flex flex-col items-center justify-center p-3.5 sm:p-4 bg-white rounded-xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-xl hover:border-red-200 hover:-translate-y-1 transition duration-200 text-center cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center p-2.5 group-hover:scale-110 group-hover:bg-red-50/50 transition-all mb-2.5 shadow-sm border border-slate-100">
                  <LogoComponent className="w-8 h-8 object-contain" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#ED0000] transition-colors leading-tight">
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
