"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Car, Sparkles, Fuel, Gauge } from "lucide-react";
import { DataStore } from "@/lib/data/store";
import { Vehicle } from "@/types";
import { formatPriceINR, formatKM } from "@/lib/utils";

interface LiveSearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
}

export default function LiveSearchAutocomplete({
  placeholder = "Search by make, model, fuel, or price...",
  className = "",
  isMobile = false,
}: LiveSearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Vehicle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live filter as user types
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const allVehicles = DataStore.getVehicles();
    const filtered = allVehicles.filter((v) => {
      const makeName = v.make?.name?.toLowerCase() || "";
      const modelName = v.model?.name?.toLowerCase() || "";
      const variant = v.variant?.toLowerCase() || "";
      const fuel = v.fuel_type?.toLowerCase() || "";
      const body = v.body_type?.toLowerCase() || "";
      const year = String(v.year);
      const combined = `${year} ${makeName} ${modelName} ${variant} ${fuel} ${body}`;

      return (
        combined.includes(q) ||
        makeName.includes(q) ||
        modelName.includes(q) ||
        variant.includes(q) ||
        fuel.includes(q) ||
        body.includes(q)
      );
    });

    setResults(filtered.slice(0, 6)); // Top 6 matches
    setIsOpen(true);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (query.trim()) {
      router.push(`/inventory?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/inventory");
    }
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length >= 1) setIsOpen(true);
            }}
            placeholder={placeholder}
            className={`w-full bg-[#162032] text-white placeholder-slate-400 border border-[#273549] rounded-l-md px-4 py-2.5 focus:outline-none focus:border-[#ED0000] focus:ring-1 focus:ring-[#ED0000] transition ${
              isMobile ? "text-xs py-2 px-3" : "text-sm py-2.5"
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className={`bg-[#ED0000] hover:bg-[#D10000] text-white font-semibold rounded-r-md transition flex items-center justify-center shrink-0 cursor-pointer ${
            isMobile ? "text-xs px-4 py-2" : "text-sm px-6 py-2.5"
          }`}
        >
          <Search className="w-4 h-4 mr-1.5 hidden sm:inline" />
          <span>Search</span>
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1726] border border-[#273549] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {results.length > 0 ? (
            <div>
              <div className="px-3 py-2 bg-[#162032] border-b border-[#273549] flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#ED0000]" />
                  Matching Vehicles ({results.length})
                </span>
                <span>Instant Preview</span>
              </div>

              <div className="divide-y divide-[#1E2D42] max-h-[380px] overflow-y-auto">
                {results.map((car) => {
                  const primaryImg = car.images?.find((img) => img.is_primary)?.image_url || car.images?.[0]?.image_url || "/cars/swift.jpg";

                  return (
                    <Link
                      key={car.id}
                      href={`/inventory/${car.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-[#1A2639] transition group"
                    >
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-[#273549]">
                        <Image
                          src={primaryImg}
                          alt={`${car.make?.name} ${car.model?.name}`}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-xs sm:text-sm truncate group-hover:text-[#ED0000] transition">
                          {car.year} {car.make?.name} {car.model?.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {car.variant}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                          <span className="flex items-center gap-0.5">
                            <Fuel className="w-2.5 h-2.5" />
                            {car.fuel_type}
                          </span>
                          <span>•</span>
                          <span>{formatKM(car.mileage)}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs sm:text-sm font-black text-amber-400">
                          {formatPriceINR(car.price)}
                        </div>
                        <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-semibold inline-block mt-0.5">
                          Verified
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Footer View All Link */}
              <Link
                href={`/inventory?search=${encodeURIComponent(query.trim())}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2.5 bg-[#121B2A] hover:bg-[#1E2D42] text-xs font-bold text-slate-300 hover:text-white transition text-center border-t border-[#273549]"
              >
                <span>View all search results for &ldquo;{query}&rdquo;</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#ED0000]" />
              </Link>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 space-y-2">
              <Car className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-xs font-semibold text-slate-300">
                No matching vehicles found for &ldquo;{query}&rdquo;
              </div>
              <p className="text-[11px] text-slate-500">
                Try searching for &quot;Swift&quot;, &quot;Creta&quot;, &quot;SUV&quot;, or &quot;Diesel&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
