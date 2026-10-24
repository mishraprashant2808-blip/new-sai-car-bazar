"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  ArrowLeft,
  Save,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Star,
  Clock,
  Flame,
  AlertCircle,
  Image as ImageIcon,
  Check,
  Plus,
} from "lucide-react";
import { DataStore } from "@/lib/data/store";
import { Vehicle, FuelType, TransmissionType, BodyType, VehicleStatus, Make } from "@/types";
import { formatPriceINR, formatKM, getAppropriateCarPhoto } from "@/lib/utils";
import ImageUploadDropzone from "@/components/admin/ImageUploadDropzone";

const ALL_FEATURE_OPTIONS = [
  "Leather Seats",
  "Electric Sunroof",
  "Panoramic Sunroof",
  "Ventilated Seats",
  "Apple CarPlay & Android Auto",
  "360 Degree Camera",
  "Cruise Control",
  "Adaptive Cruise Control",
  "Alloy Wheels",
  "Push Button Start",
  "Keyless Entry",
  "Airbags (6+)",
  "ADAS Level 2",
  "Automatic Climate Control",
  "Wireless Phone Charger",
  "LED Projector Headlamps",
  "Power Adjustable Driver Seat",
  "Electronic Stability Control",
  "Hill Hold Assist",
  "Tyre Pressure Monitor (TPMS)",
];

export default function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [makes, setMakes] = useState<Make[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  // Form State
  const [makeId, setMakeId] = useState("");
  const [modelName, setModelName] = useState("");
  const [variant, setVariant] = useState("");
  const [year, setYear] = useState<number>(2023);
  const [price, setPrice] = useState<number>(1500000);
  const [mileage, setMileage] = useState<number>(25000);
  const [fuelType, setFuelType] = useState<FuelType>("DIESEL");
  const [transmission, setTransmission] = useState<TransmissionType>("AUTOMATIC");
  const [bodyType, setBodyType] = useState<BodyType>("SUV");
  const [color, setColor] = useState("White");
  const [regNumber, setRegNumber] = useState("");
  const [ownership, setOwnership] = useState("1st Owner");
  const [insurance, setInsurance] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isHotDeal, setIsHotDeal] = useState(false);
  const [status, setStatus] = useState<VehicleStatus>("AVAILABLE");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState("");

  // Load makes and vehicle
  useEffect(() => {
    const loadedMakes = DataStore.getMakes();
    setMakes(loadedMakes);

    async function loadVehicle() {
      setIsLoading(true);
      setErrorMsg("");

      try {
        // Try to fetch via API first
        const res = await fetch(`/api/admin/vehicles/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            populateForm(json.data);
            setIsLoading(false);
            return;
          }
        }

        // Fallback to local DataStore
        const storeVehicle = DataStore.getVehicleById(id) || DataStore.getVehicleBySlug(id);
        if (storeVehicle) {
          populateForm(storeVehicle);
        } else {
          setErrorMsg("Vehicle not found. It may have been removed or the ID is invalid.");
        }
      } catch (err: any) {
        // Fallback to DataStore on network failure
        const storeVehicle = DataStore.getVehicleById(id) || DataStore.getVehicleBySlug(id);
        if (storeVehicle) {
          populateForm(storeVehicle);
        } else {
          setErrorMsg(err.message || "Failed to load vehicle details.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadVehicle();
  }, [id]);

  const populateForm = (v: Vehicle) => {
    setVehicle(v);
    setMakeId(v.make_id || "");
    setModelName(v.model?.name || "");
    setVariant(v.variant || "");
    setYear(v.year || 2023);
    setPrice(v.price || 0);
    setMileage(v.mileage || 0);
    setFuelType(v.fuel_type || "DIESEL");
    setTransmission(v.transmission || "AUTOMATIC");
    setBodyType(v.body_type || "SUV");
    setColor(v.color || "White");
    setRegNumber(v.registration_number || "");
    setOwnership(v.ownership || "1st Owner");
    setInsurance(v.insurance_validity || "");
    const rawImg = v.images?.[0]?.image_url;
    const finalImg = rawImg && !rawImg.includes("photo-1549399542-7e3f8b79c341") && !rawImg.includes("photo-1617814076367") && !rawImg.includes("photo-1533473359331")
      ? rawImg
      : getAppropriateCarPhoto(v.make?.name, v.model?.name || v.variant, v.body_type);
    setImageUrl(finalImg);
    setDescription(v.description || "");
    setIsFeatured(Boolean(v.is_featured));
    setIsNewArrival(Boolean(v.is_new_arrival));
    setIsHotDeal(Boolean(v.is_hot_deal));
    setStatus(v.status || "AVAILABLE");
    setSelectedFeatures(Array.isArray(v.features) ? v.features : []);
  };

  const toggleFeature = (f: string) => {
    if (selectedFeatures.includes(f)) {
      setSelectedFeatures(selectedFeatures.filter((x) => x !== f));
    } else {
      setSelectedFeatures([...selectedFeatures, f]);
    }
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      setSelectedFeatures([...selectedFeatures, customFeature.trim()]);
      setCustomFeature("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const selectedMakeObj = makes.find((m) => m.id === makeId);
    const finalPhoto = imageUrl.trim() || getAppropriateCarPhoto(selectedMakeObj?.name, modelName || variant, bodyType);

    const updatedData: Partial<Vehicle> & { imageUrl?: string } = {
      make_id: makeId,
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
      ownership,
      insurance_validity: insurance,
      description,
      features: selectedFeatures,
      status,
      is_featured: isFeatured,
      is_new_arrival: isNewArrival,
      is_hot_deal: isHotDeal,
      imageUrl: finalPhoto,
    };

    if (vehicle) {
      updatedData.images = [
        {
          id: vehicle.images?.[0]?.id || `img-${Date.now()}`,
          vehicle_id: vehicle.id,
          storage_path: finalPhoto,
          image_url: finalPhoto,
          alt_text: `${variant || modelName || "Vehicle"}`,
          sort_order: 0,
          is_primary: true,
        },
      ];
    }

    try {
      // 1. Send update to server API
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to update vehicle on server");
      }

      // 2. Also ensure DataStore local cache has updated copy
      DataStore.updateVehicle(id, updatedData);

      setSuccessMsg("Vehicle details updated successfully!");
      setTimeout(() => {
        router.push("/admin/inventory");
      }, 1200);
    } catch (err: any) {
      // Fallback: update in DataStore directly so admin work is not lost
      DataStore.updateVehicle(id, updatedData);
      setSuccessMsg("Saved locally in cache. Server response: " + (err.message || "updated"));
      setTimeout(() => {
        router.push("/admin/inventory");
      }, 1500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicle) return;
    const confirmName = `${vehicle.year} ${vehicle.make?.name || ""} ${vehicle.model?.name || ""} ${vehicle.variant || ""}`.trim();
    if (!confirm(`Are you sure you want to permanently delete "${confirmName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await fetch(`/api/admin/vehicles/${id}`, { method: "DELETE" });
      DataStore.deleteVehicle(id);
      router.push("/admin/inventory");
    } catch {
      DataStore.deleteVehicle(id);
      router.push("/admin/inventory");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-[#ED0000] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading vehicle details...</span>
      </div>
    );
  }

  if (errorMsg && !vehicle) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-sm text-slate-400">{errorMsg}</p>
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-2 bg-[#162032] border border-[#273549] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1E293B] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manage Vehicles</span>
        </Link>
      </div>
    );
  }

  const vehicleTitle = `${year} ${makes.find((m) => m.id === makeId)?.name || vehicle?.make?.name || ""} ${modelName || vehicle?.model?.name || ""} ${variant}`.trim();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="p-2 bg-[#162032] border border-[#273549] rounded-lg text-slate-300 hover:text-white transition"
            title="Back to inventory"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Edit Vehicle Details
              </h1>
              {vehicle?.stock_number && (
                <span className="text-xs px-2.5 py-0.5 rounded-md font-mono font-bold bg-[#162032] border border-[#273549] text-amber-400">
                  {vehicle.stock_number}
                </span>
              )}
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  status === "AVAILABLE"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : status === "RESERVED"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 truncate max-w-xl">
              {vehicleTitle || "Update specifications, pricing, imagery, and inventory badges"}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {vehicle?.slug && (
            <Link
              href={`/inventory/${vehicle.slug}`}
              target="_blank"
              className="bg-[#162032] hover:bg-[#1E293B] border border-[#273549] text-slate-300 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5"
              title="View on customer website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Public Page</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Permanently remove vehicle"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2.5 shadow-lg">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Core Details */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-[#ED0000]" />
              <h3 className="text-base font-bold text-white">1. Core Vehicle Information</h3>
            </div>
            <span className="text-xs text-slate-400">Make, Model, Year, Price</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Make */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Make / Brand *
              </label>
              <select
                value={makeId}
                onChange={(e) => setMakeId(e.target.value)}
                required
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              >
                {makes.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Model Name *
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
                placeholder="e.g. Fortuner, Creta, Harrier"
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              />
            </div>

            {/* Variant */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Variant / Trim
              </label>
              <input
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="e.g. 2.8 4x2 AT, SX (O)"
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              />
            </div>

            {/* Manufacturing Year */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Manufacturing Year *
              </label>
              <input
                type="number"
                min="2005"
                max="2027"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                required
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              />
            </div>

            {/* Price (INR) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Price (₹ INR) *
                </label>
                <span className="text-xs font-bold text-emerald-400">
                  {formatPriceINR(price)}
                </span>
              </div>
              <input
                type="number"
                step="5000"
                min="50000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              />
            </div>

            {/* Mileage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Odometer (KM) *
                </label>
                <span className="text-xs text-slate-400">
                  {formatKM(mileage)}
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="500"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                required
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Technical Specifications & Status */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="pb-3 border-b border-[#1E293B]">
            <h3 className="text-base font-bold text-white">2. Technical Specs & Verification</h3>
            <p className="text-xs text-slate-400">Fuel, Transmission, Registration, and Status</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Fuel Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Transmission
              </label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              >
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Body Type
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as BodyType)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              >
                <option value="SUV">SUV</option>
                <option value="SEDAN">Sedan</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="MUV">MUV</option>
                <option value="LUXURY">Luxury</option>
              </select>
            </div>

            {/* Inventory Status */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Inventory Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition font-bold"
              >
                <option value="AVAILABLE">AVAILABLE (Active for sale)</option>
                <option value="RESERVED">RESERVED (Under token)</option>
                <option value="SOLD">SOLD (Completed)</option>
                <option value="DRAFT">DRAFT (Hidden)</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Exterior Color
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="White, Black, Silver..."
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              />
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Registration No.
              </label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                placeholder="UP 32 XX 0000"
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition font-mono uppercase"
              />
            </div>

            {/* Ownership */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Ownership
              </label>
              <select
                value={ownership}
                onChange={(e) => setOwnership(e.target.value)}
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              >
                <option value="1st Owner">1st Owner</option>
                <option value="2nd Owner">2nd Owner</option>
                <option value="3rd Owner">3rd Owner</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Insurance Validity */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Insurance Validity
              </label>
              <input
                type="text"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                placeholder="Comprehensive valid until..."
                className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] transition"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Badges & Merchandising Highlights */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="pb-3 border-b border-[#1E293B]">
            <h3 className="text-base font-bold text-white">3. Showcase Badges</h3>
            <p className="text-xs text-slate-400">Highlight this vehicle across homepage and catalog filters</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Featured */}
            <label
              className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition ${
                isFeatured
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : "bg-[#162032] border-[#273549] text-slate-400 hover:border-slate-600"
              }`}
            >
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="hidden"
              />
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isFeatured ? "bg-amber-500 text-black font-black" : "bg-[#0A0F1D] text-slate-500"
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Featured Vehicle</span>
                <span className="text-xs text-slate-400">Shows in homepage carousel</span>
              </div>
            </label>

            {/* New Arrival */}
            <label
              className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition ${
                isNewArrival
                  ? "bg-blue-500/10 border-blue-500/40 text-blue-300"
                  : "bg-[#162032] border-[#273549] text-slate-400 hover:border-slate-600"
              }`}
            >
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="hidden"
              />
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isNewArrival ? "bg-blue-500 text-white font-black" : "bg-[#0A0F1D] text-slate-500"
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">New Arrival</span>
                <span className="text-xs text-slate-400">Tagged with fresh stock badge</span>
              </div>
            </label>

            {/* Hot Deal */}
            <label
              className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition ${
                isHotDeal
                  ? "bg-red-500/10 border-red-500/40 text-red-300"
                  : "bg-[#162032] border-[#273549] text-slate-400 hover:border-slate-600"
              }`}
            >
              <input
                type="checkbox"
                checked={isHotDeal}
                onChange={(e) => setIsHotDeal(e.target.checked)}
                className="hidden"
              />
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isHotDeal ? "bg-[#ED0000] text-white font-black" : "bg-[#0A0F1D] text-slate-500"
                }`}
              >
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white">Hot Deal</span>
                <span className="text-xs text-slate-400">Marked down promotional deal</span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 4: Features & Equipment */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="pb-3 border-b border-[#1E293B]">
            <h3 className="text-base font-bold text-white">4. Key Features & Equipment</h3>
            <p className="text-xs text-slate-400">Select active equipment installed in this vehicle</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {ALL_FEATURE_OPTIONS.map((feat) => {
              const active = selectedFeatures.includes(feat);
              return (
                <button
                  type="button"
                  key={feat}
                  onClick={() => toggleFeature(feat)}
                  className={`text-xs font-semibold px-3.5 py-2 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? "bg-[#ED0000]/15 border-[#ED0000] text-white"
                      : "bg-[#162032] border-[#273549] text-slate-400 hover:text-white hover:border-slate-600"
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 text-[#ED0000]" />}
                  <span>{feat}</span>
                </button>
              );
            })}
          </div>

          {/* Add custom feature tag */}
          <div className="pt-3 border-t border-[#1E293B] flex items-center gap-3">
            <input
              type="text"
              value={customFeature}
              onChange={(e) => setCustomFeature(e.target.value)}
              placeholder="Add custom feature (e.g. Tow Bar, Subwoofer)..."
              className="bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ED0000] transition flex-1 max-w-md"
            />
            <button
              type="button"
              onClick={handleAddCustomFeature}
              className="bg-[#162032] hover:bg-[#1E293B] border border-[#273549] text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tag</span>
            </button>
          </div>
        </div>

        {/* Section 5: Media & Description */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="pb-3 border-b border-[#1E293B]">
            <h3 className="text-base font-bold text-white">5. Imagery & Description</h3>
            <p className="text-xs text-slate-400">High-resolution cover image and dealer inspection summary</p>
          </div>

          <div className="space-y-6">
            <ImageUploadDropzone
              value={imageUrl}
              onChange={setImageUrl}
              label="Vehicle Cover Photo"
              helperText="Upload car photos directly from your phone gallery or drag & drop files from your PC"
            />

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Vehicle Description & Dealer Notes
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Certified condition, service history, inspection notes..."
                className="w-full bg-[#162032] border border-[#273549] rounded-lg p-3.5 text-xs text-white focus:outline-none focus:border-[#ED0000] transition leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Floating Bottom Sticky Action Bar */}
        <div className="sticky bottom-4 z-20 bg-[#0F1827]/95 backdrop-blur-md border border-[#273549] rounded-2xl p-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2.5 rounded-lg transition"
            >
              Cancel
            </Link>
            <span className="hidden sm:inline text-xs text-slate-500">
              Editing: <strong className="text-white">{vehicleTitle}</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#ED0000] hover:bg-[#D10000] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-lg transition flex items-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "Saving Vehicle..." : "Save Vehicle Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
