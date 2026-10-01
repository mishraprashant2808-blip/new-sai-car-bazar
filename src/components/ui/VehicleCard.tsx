"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Fuel, Gauge, Settings, ShieldCheck, MessageCircle } from "lucide-react";
import { Vehicle } from "@/types";
import { formatPriceINR, formatKM, calculateEMI, createWhatsAppUrl } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(vehicle.id);

  const primaryImage =
    vehicle.images.find((img) => img.is_primary)?.image_url ||
    vehicle.images[0]?.image_url ||
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80";

  // Calculate 5-year EMI estimate with 20% down payment
  const loanPrincipal = vehicle.price * 0.8;
  const emiCalc = calculateEMI(loanPrincipal, 9.5, 60);

  const whatsappMessage = `Hello New Sai Car Bazar, I am interested in the ${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name} (${vehicle.variant}) listed at ${formatPriceINR(vehicle.price)}. Is it currently available for inspection?`;

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <Image
          src={primaryImage}
          alt={`${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay matching Screenshot 2 */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {vehicle.is_featured && (
            <span className="bg-[#ED0000] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded shadow-md tracking-wider">
              FEATURED
            </span>
          )}
          {vehicle.is_new_arrival && (
            <span className="bg-[#ED0000] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded shadow-md tracking-wider">
              NEW ARRIVAL
            </span>
          )}
          {vehicle.is_hot_deal && (
            <span className="bg-[#ED0000] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded shadow-md tracking-wider">
              HOT DEAL
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(vehicle.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 ${
            isSaved
              ? "bg-[#ED0000] text-white"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
          title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
        </button>

        {/* Certification Tag */}
        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-slate-200 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>150-Point Certified</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={`/inventory/${vehicle.slug}`}>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl group-hover:text-[#ED0000] transition line-clamp-1">
              {vehicle.year} {vehicle.make?.name} {vehicle.model?.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
            {vehicle.variant} • {vehicle.color || "Metallic"}
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-3.5 my-3 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5" title="Mileage">
              <Gauge className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate font-medium">{formatKM(vehicle.mileage)}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Fuel Type">
              <Fuel className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate font-medium capitalize">{vehicle.fuel_type.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Transmission">
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate font-medium capitalize">{vehicle.transmission.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-1">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {formatPriceINR(vehicle.price)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                EMI from ₹{emiCalc.monthlyEMI.toLocaleString('en-IN')}/mo
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {vehicle.ownership || "1st Owner"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/inventory/${vehicle.slug}`}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded text-center transition flex items-center justify-center cursor-pointer"
            >
              View Details
            </Link>

            <a
              href={createWhatsAppUrl("+918172946630", whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded text-center transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
