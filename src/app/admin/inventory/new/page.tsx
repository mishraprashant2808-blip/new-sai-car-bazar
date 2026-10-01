"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Plus, ArrowLeft, CheckCircle2, Upload } from "lucide-react";
import { DataStore } from "@/lib/data/store";
import { FuelType, TransmissionType, BodyType, VehicleStatus } from "@/types";

export default function AdminNewVehiclePage() {
  const router = useRouter();
  const makes = DataStore.getMakes();

  const [makeId, setMakeId] = useState(makes[0]?.id || "");
  const [modelName, setModelName] = useState("");
  const [variant, setVariant] = useState("");
  const [year, setYear] = useState<number>(2023);
  const [price, setPrice] = useState<number>(1500000);
  const [mileage, setMileage] = useState<number>(25000);
  const [fuelType, setFuelType] = useState<FuelType>("DIESEL");
  const [transmission, setTransmission] = useState<TransmissionType>("AUTOMATIC");
  const [bodyType, setBodyType] = useState<BodyType>("SUV");
  const [color, setColor] = useState("White");
  const [regNumber, setRegNumber] = useState("UP 32 XX 0000");
  const [ownership, setOwnership] = useState("1st Owner");
  const [insurance, setInsurance] = useState("Comprehensive valid until 2026");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isHotDeal, setIsHotDeal] = useState(false);
  const [status, setStatus] = useState<VehicleStatus>("AVAILABLE");

  // Selected features
  const defaultFeatureOptions = [
    "Leather Seats",
    "Electric Sunroof",
    "Ventilated Seats",
    "Apple CarPlay & Android Auto",
    "360 Degree Camera",
    "Cruise Control",
    "Alloy Wheels",
    "Push Button Start",
    "Airbags (6+)",
    "ADAS Level 2",
    "Automatic Climate Control",
  ];
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "Leather Seats",
    "Alloy Wheels",
    "Apple CarPlay & Android Auto",
  ]);

  const toggleFeature = (f: string) => {
    if (selectedFeatures.includes(f)) {
      setSelectedFeatures(selectedFeatures.filter((x) => x !== f));
    } else {
      setSelectedFeatures([...selectedFeatures, f]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedMakeObj = makes.find((m) => m.id === makeId) || makes[0];
    const generatedSlug = `${selectedMakeObj.name.toLowerCase()}-${modelName.toLowerCase().replace(/\s+/g, '-')}-${year}-${Date.now().toString().slice(-4)}`;
    const stockNumber = `NSCB-${year}-${Math.floor(100 + Math.random() * 900)}`;

    DataStore.addVehicle({
      stock_number: stockNumber,
      slug: generatedSlug,
      make_id: makeId,
      model_id: "mod-custom",
      variant,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      fuel_type: fuelType,
      transmission,
      body_type: bodyType,
      color,
      registration_number: regNumber,
      registration_year: Number(year),
      rto_state: "UP",
      ownership,
      insurance_validity: insurance,
      description: description || `Certified ${year} ${selectedMakeObj.name} ${modelName} in excellent condition, verified with 150-point inspection at New Sai Car Bazar.`,
      features: selectedFeatures,
      status,
      is_featured: isFeatured,
      is_new_arrival: isNewArrival,
      is_hot_deal: isHotDeal,
      images: [
        {
          id: `img-${Date.now()}`,
          vehicle_id: "new",
          storage_path: "cars/photo.webp",
          image_url: imageUrl,
          alt_text: `${selectedMakeObj.name} ${modelName}`,
          sort_order: 0,
          is_primary: true,
        },
      ],
    });

    router.push("/admin/inventory");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="p-2 bg-[#162032] border border-[#273549] rounded-lg text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Add New Vehicle</h1>
            <p className="text-xs text-slate-400">Register new car into showroom inventory</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Section 1: Basic Info */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#1E293B]">
            1. Core Vehicle Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Make / Brand *</label>
              <select
                value={makeId}
                onChange={(e) => setMakeId(e.target.value)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg p-2.5 text-sm text-white"
              >
                {makes.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Model Name *</label>
              <input
                type="text"
                required
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g. Fortuner, Creta, City"
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Variant / Trim</label>
              <input
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="e.g. 2.8 4x2 AT, SX(O)"
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Year of Manufacture *</label>
              <input
                type="number"
                required
                min={2005}
                max={2026}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Showroom Price (₹) *</label>
              <input
                type="number"
                required
                min={50000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kilometers Driven *</label>
              <input
                type="number"
                required
                min={0}
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Technical Specifications */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#1E293B]">
            2. Technical Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg p-2.5 text-sm text-white"
              >
                <option value="DIESEL">Diesel</option>
                <option value="PETROL">Petrol</option>
                <option value="CNG">CNG</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg p-2.5 text-sm text-white"
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Body Type</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as BodyType)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg p-2.5 text-sm text-white"
              >
                <option value="SUV">SUV</option>
                <option value="SEDAN">Sedan</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="MUV">MUV</option>
                <option value="LUXURY">Luxury</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. White, Black"
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Registration & Image */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#1E293B]">
            3. Registration & Photography
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Number</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="UP 32 XX 1234"
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ownership</label>
              <select
                value={ownership}
                onChange={(e) => setOwnership(e.target.value)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg p-2.5 text-sm text-white"
              >
                <option value="1st Owner">1st Owner</option>
                <option value="2nd Owner">2nd Owner</option>
                <option value="3rd Owner">3rd Owner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg p-2.5 text-sm text-white"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Image URL</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white font-mono text-xs"
            />
          </div>
        </div>

        {/* Section 4: Features */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#1E293B]">
            4. Features & Highlights
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {defaultFeatureOptions.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFeature(f)}
                className={`text-left p-2.5 rounded-lg border text-xs font-semibold transition flex items-center justify-between ${
                  selectedFeatures.includes(f)
                    ? "bg-[#ED0000]/10 border-[#ED0000] text-white"
                    : "bg-[#162032] border-[#273549] text-slate-400 hover:text-white"
                }`}
              >
                <span>{f}</span>
                {selectedFeatures.includes(f) && <CheckCircle2 className="w-4 h-4 text-[#ED0000]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Section 5: Marketing Badges */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#1E293B]">
            5. Marketing Badges
          </h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer bg-[#162032] border border-[#273549] px-4 py-2 rounded-lg text-xs font-semibold">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-[#ED0000] w-4 h-4"
              />
              <span>Mark as Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-[#162032] border border-[#273549] px-4 py-2 rounded-lg text-xs font-semibold">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="accent-[#ED0000] w-4 h-4"
              />
              <span>Mark as New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-[#162032] border border-[#273549] px-4 py-2 rounded-lg text-xs font-semibold">
              <input
                type="checkbox"
                checked={isHotDeal}
                onChange={(e) => setIsHotDeal(e.target.checked)}
                className="accent-[#ED0000] w-4 h-4"
              />
              <span>Mark as Hot Deal</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#1E293B] flex justify-end gap-4">
          <Link
            href="/admin/inventory"
            className="px-6 py-3 bg-[#162032] hover:bg-[#1E293B] text-slate-300 font-semibold rounded-lg text-sm transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3 bg-[#ED0000] hover:bg-[#D10000] text-white font-bold rounded-lg text-sm transition shadow-lg shadow-red-950/40 cursor-pointer"
          >
            Save & Publish Car
          </button>
        </div>
      </form>
    </div>
  );
}
