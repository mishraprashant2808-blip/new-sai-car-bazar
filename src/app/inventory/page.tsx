"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from "lucide-react";
import VehicleCard from "@/components/ui/VehicleCard";
import { DataStore, InventoryFilterParams } from "@/lib/data/store";
import { Make } from "@/types";

function InventoryContent() {
  const searchParams = useSearchParams();

  // Initial params from URL
  const initialSearch = searchParams.get("search") || "";
  const initialMake = searchParams.get("make") || "all";
  const initialBodyType = searchParams.get("bodyType") || "all";
  const initialFuel = searchParams.get("fuel") || "all";
  const initialTransmission = searchParams.get("transmission") || "all";
  const initialMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 5000000;

  const [search, setSearch] = useState(initialSearch);
  const [selectedMake, setSelectedMake] = useState(initialMake);
  const [selectedBodyType, setSelectedBodyType] = useState(initialBodyType);
  const [selectedFuel, setSelectedFuel] = useState(initialFuel);
  const [selectedTransmission, setSelectedTransmission] = useState(initialTransmission);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [sortBy, setSortBy] = useState<InventoryFilterParams['sortBy']>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL params if they change
  useEffect(() => {
    if (searchParams.get("search") !== null) {
      setSearch(searchParams.get("search") || "");
    }
    if (searchParams.get("make")) {
      setSelectedMake(searchParams.get("make") || "all");
    }
  }, [searchParams]);

  const makes: Make[] = useMemo(() => DataStore.getMakes(), []);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return DataStore.getVehicles({
      search: search || undefined,
      make: selectedMake !== "all" ? selectedMake : undefined,
      bodyType: selectedBodyType !== "all" ? selectedBodyType : undefined,
      fuel: selectedFuel !== "all" ? selectedFuel : undefined,
      transmission: selectedTransmission !== "all" ? selectedTransmission : undefined,
      maxPrice: maxPrice < 5000000 ? maxPrice : undefined,
      sortBy,
    });
  }, [search, selectedMake, selectedBodyType, selectedFuel, selectedTransmission, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setSelectedMake("all");
    setSelectedBodyType("all");
    setSelectedFuel("all");
    setSelectedTransmission("all");
    setMaxPrice(5000000);
    setSortBy("newest");
  };

  const hasActiveFilters =
    search ||
    selectedMake !== "all" ||
    selectedBodyType !== "all" ||
    selectedFuel !== "all" ||
    selectedTransmission !== "all" ||
    maxPrice < 5000000;

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title & Breadcrumbs */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            New Sai Car Bazar • Inventory Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Certified Used Vehicles
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Explore 100% verified, multi-point inspected pre-owned cars in Barabanki with immediate registration transfer.
          </p>
        </div>

        {/* Top Control Bar (Search, Mobile Filter Button, Sort Dropdown) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="w-full md:w-96 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model, make, or specs..."
              className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#ED0000] focus:ring-1 focus:ring-[#ED0000]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters {hasActiveFilters && "•"}</span>
            </button>

            {/* Sort Options */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 ml-auto md:ml-0">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#ED0000]"
              >
                <option value="newest">Newest Year</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="mileage_asc">Lowest Mileage</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Vehicle Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <SlidersHorizontal className="w-4 h-4 text-[#ED0000]" />
                <span>Filter Vehicles</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#ED0000] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Make Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Make / Manufacturer
              </label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#ED0000]"
              >
                <option value="all">All Brands</option>
                {makes.map((m) => (
                  <option key={m.id} value={m.slug}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Type Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Body Type
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["all", "suv", "sedan", "hatchback"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedBodyType(type)}
                    className={`py-2 px-3 rounded-lg border font-semibold uppercase text-[11px] transition ${
                      selectedBodyType === type
                        ? "bg-[#ED0000] text-white border-[#ED0000]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Fuel Type
              </label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#ED0000]"
              >
                <option value="all">All Fuel Types</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG</option>
                <option value="electric">Electric</option>
              </select>
            </div>

            {/* Transmission Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Transmission
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["all", "automatic", "manual"].map((trans) => (
                  <button
                    key={trans}
                    type="button"
                    onClick={() => setSelectedTransmission(trans)}
                    className={`py-2 px-3 rounded-lg border font-semibold uppercase text-[11px] transition ${
                      selectedTransmission === trans
                        ? "bg-[#ED0000] text-white border-[#ED0000]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {trans}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Budget Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span className="uppercase tracking-wider">Max Budget</span>
                <span className="text-[#ED0000] font-black">
                  {maxPrice >= 5000000 ? "Any Budget" : `₹${(maxPrice / 100000).toFixed(1)} Lakh`}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#ED0000] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹5L</span>
                <span>₹25L</span>
                <span>₹50L+</span>
              </div>
            </div>
          </aside>

          {/* Vehicle Cards Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-600">
                Showing <strong className="text-slate-900">{filteredVehicles.length}</strong> vehicles in Barabanki
              </span>
            </div>

            {filteredVehicles.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-800">No matching vehicles found</h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                  Try adjusting or clearing your filters to see more certified used cars in our inventory.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 bg-[#ED0000] hover:bg-[#D10000] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white text-slate-900 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-base">Filter Cars</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Make */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Make</label>
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full bg-slate-50 border rounded p-2 text-sm"
                  >
                    <option value="all">All Brands</option>
                    {makes.map((m) => (
                      <option key={m.id} value={m.slug}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* Fuel */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Fuel</label>
                  <select
                    value={selectedFuel}
                    onChange={(e) => setSelectedFuel(e.target.value)}
                    className="w-full bg-slate-50 border rounded p-2 text-sm"
                  >
                    <option value="all">All Fuels</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="cng">CNG</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Transmission</label>
                  <select
                    value={selectedTransmission}
                    onChange={(e) => setSelectedTransmission(e.target.value)}
                    className="w-full bg-slate-50 border rounded p-2 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t mt-6 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 bg-slate-100 font-bold py-2.5 rounded text-xs text-slate-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 bg-[#ED0000] text-white font-bold py-2.5 rounded text-xs"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-white">Loading Inventory...</div>}>
      <InventoryContent />
    </Suspense>
  );
}
