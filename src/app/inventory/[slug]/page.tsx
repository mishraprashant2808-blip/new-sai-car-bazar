"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Calculator,
  ShieldCheck,
  Fuel,
  Gauge,
  Settings,
  Calendar,
  UserCheck,
  CheckCircle,
  Car,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { DataStore } from "@/lib/data/store";
import { formatPriceINR, formatKM, calculateEMI, createWhatsAppUrl, createPhoneCallUrl } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import EnquiryModal from "@/components/ui/EnquiryModal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function VehicleDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const vehicle = DataStore.getVehicleBySlug(resolvedParams.slug);

  if (!vehicle) {
    notFound();
  }

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(vehicle.id);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const images = vehicle.images.length > 0
    ? vehicle.images
    : [
        {
          id: "placeholder",
          vehicle_id: vehicle.id,
          storage_path: "cars/placeholder.webp",
          image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
          alt_text: vehicle.variant || "Car",
          sort_order: 0,
          is_primary: true,
        },
      ];

  const currentImage = images[selectedImageIdx] || images[0];

  // Estimated EMI (20% Down Payment, 60 Months, 9.5%)
  const loanPrincipal = vehicle.price * 0.8;
  const emiData = calculateEMI(loanPrincipal, 9.5, 60);

  const whatsappMessage = `Hello New Sai Car Bazar, I am interested in the ${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name} (${vehicle.variant}) listed at ${formatPriceINR(vehicle.price)} on your website. Please share more details and availability.`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Similar vehicles
  const similarVehicles = DataStore.getVehicles()
    .filter((v) => v.id !== vehicle.id && (v.body_type === vehicle.body_type || v.make_id === vehicle.make_id))
    .slice(0, 3);

  return (
    <div className="bg-[#0A0F1D] text-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/inventory" className="hover:text-white transition">Inventory</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 truncate">{vehicle.year} {vehicle.make?.name} {vehicle.model?.name}</span>
        </div>

        {/* Top Header Row: Title, Badges, Wishlist & Share */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[#1E293B] gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#ED0000] text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                {vehicle.status}
              </span>
              {vehicle.is_featured && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-2 py-0.5 rounded">
                  Featured
                </span>
              )}
              {vehicle.is_new_arrival && (
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold px-2 py-0.5 rounded">
                  New Arrival
                </span>
              )}
              <span className="text-xs text-slate-400 font-mono">Stock #{vehicle.stock_number}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {vehicle.year} {vehicle.make?.name} {vehicle.model?.name}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1 font-medium">
              {vehicle.variant} • {vehicle.color} • Registered in {vehicle.rto_state || "UP"}
            </p>
          </div>

          {/* Price & Quick Actions */}
          <div className="flex items-center lg:items-end justify-between lg:flex-col gap-3">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#ED0000]">
                {formatPriceINR(vehicle.price)}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                EMI starts @ <strong className="text-white">₹{emiData.monthlyEMI.toLocaleString('en-IN')}/mo</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleWishlist(vehicle.id)}
                className={`p-2.5 rounded-lg border transition flex items-center gap-2 text-xs font-bold ${
                  isSaved
                    ? "bg-[#ED0000] border-[#ED0000] text-white"
                    : "bg-[#162032] border-[#273549] text-slate-300 hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
                <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-[#162032] border border-[#273549] text-slate-300 hover:text-white rounded-lg transition flex items-center gap-2 text-xs font-bold"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{copied ? "Copied Link!" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery & Quick Inquiry Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Gallery (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-[#273549] shadow-2xl">
              <Image
                src={currentImage.image_url}
                alt={currentImage.alt_text || vehicle.variant || "Car"}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-slate-300 border border-white/10 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>150-Point Certified Guarantee</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                      selectedImageIdx === idx
                        ? "border-[#ED0000] scale-95"
                        : "border-[#273549] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || "Thumbnail"}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Contact & Lead CTA Card (4 cols) */}
          <div className="lg:col-span-4 bg-[#121B2A] border border-[#273549] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-bold text-[#ED0000] uppercase tracking-wider mb-1">
                Direct Showroom Contact
              </div>
              <h3 className="text-xl font-bold text-white">
                Ready to take a test drive?
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Connect directly with our manager in Barabanki for doorstep inspection, transparent pricing & RC transfer.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <a
                  href={createWhatsAppUrl("+918172946630", whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-950/40 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={createPhoneCallUrl("8858982362")}
                  className="w-full bg-[#1C293A] hover:bg-[#273549] text-white font-bold py-3.5 px-4 rounded-xl border border-[#334155] transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#ED0000]" />
                  <span>Call 8858982362</span>
                </a>

                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="w-full bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  <span>Book Test Drive / Enquire</span>
                </button>

                <Link
                  href={`/finance?price=${vehicle.price}&vehicle=${encodeURIComponent(`${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name}`)}`}
                  className="w-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs border border-slate-700"
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>Finance This Car (EMI Calculator)</span>
                </Link>
              </div>
            </div>

            {/* Dealership Promise Badges */}
            <div className="pt-4 border-t border-[#1E293B] space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Ownership & Clear RC</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Non-Accidental Certified Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Quick Paperwork & On-Spot Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specs & Features Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Key Specifications Table (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Specs Icons Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#121B2A] border border-[#273549] rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1C293A] flex items-center justify-center text-[#ED0000]">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Mileage</div>
                  <div className="font-bold text-sm text-white">{formatKM(vehicle.mileage)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1C293A] flex items-center justify-center text-[#ED0000]">
                  <Fuel className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Fuel Type</div>
                  <div className="font-bold text-sm text-white capitalize">{vehicle.fuel_type.toLowerCase()}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1C293A] flex items-center justify-center text-[#ED0000]">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Transmission</div>
                  <div className="font-bold text-sm text-white capitalize">{vehicle.transmission.toLowerCase()}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1C293A] flex items-center justify-center text-[#ED0000]">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Ownership</div>
                  <div className="font-bold text-sm text-white">{vehicle.ownership || "1st Owner"}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#121B2A] border border-[#273549] rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-4">Vehicle Overview</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            {/* Features Checklist */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-[#121B2A] border border-[#273549] rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-6">Installed Features & Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {vehicle.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-red-600/20 text-[#ED0000] flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Matrix */}
            <div className="bg-[#121B2A] border border-[#273549] rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-6">Technical Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm divide-y sm:divide-y-0 divide-[#1E293B]">
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">Make</span>
                  <span className="font-semibold text-white">{vehicle.make?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">Model</span>
                  <span className="font-semibold text-white">{vehicle.model?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">Variant</span>
                  <span className="font-semibold text-white">{vehicle.variant}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">Manufacturing Year</span>
                  <span className="font-semibold text-white">{vehicle.year}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">Registration Year</span>
                  <span className="font-semibold text-white">{vehicle.registration_year || vehicle.year}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">Registration Number</span>
                  <span className="font-semibold text-white">{vehicle.registration_number || "Available on request"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">RTO Location</span>
                  <span className="font-semibold text-white">Barabanki / UP</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">Insurance Status</span>
                  <span className="font-semibold text-white">{vehicle.insurance_validity || "Active Valid"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Loan Calculator Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#121B2A] border border-[#273549] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-5 h-5 text-[#ED0000]" />
                <h3 className="font-bold text-lg text-white">Instant EMI Estimator</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Based on standard 9.5% annual interest rate with 20% down payment over 5 years.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">Vehicle Price</span>
                  <span className="font-bold text-white">{formatPriceINR(vehicle.price)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">Down Payment (20%)</span>
                  <span className="font-bold text-white">{formatPriceINR(vehicle.price * 0.2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E293B]">
                  <span className="text-slate-400">Loan Amount (80%)</span>
                  <span className="font-bold text-white">{formatPriceINR(loanPrincipal)}</span>
                </div>
                <div className="p-4 bg-[#1C293A] rounded-xl text-center">
                  <div className="text-[11px] text-slate-300 font-semibold uppercase">Estimated Monthly EMI</div>
                  <div className="text-2xl font-black text-[#ED0000] mt-1">
                    ₹{emiData.monthlyEMI.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">for 60 Months tenure</div>
                </div>
              </div>

              <Link
                href={`/finance?price=${vehicle.price}&vehicle=${encodeURIComponent(`${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name}`)}`}
                className="mt-6 w-full block bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-2.5 rounded-lg text-center text-xs transition"
              >
                Customize Down Payment & Tenure →
              </Link>
            </div>
          </div>
        </div>

        {/* Similar Vehicles Section */}
        {similarVehicles.length > 0 && (
          <div className="pt-12 border-t border-[#1E293B]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-white">Similar Vehicles in Barabanki</h2>
              <Link href="/inventory" className="text-xs font-bold text-[#ED0000] hover:underline flex items-center gap-1">
                <span>View Full Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((simCar) => (
                <div key={simCar.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  {/* Reuse card logic */}
                  <Link href={`/inventory/${simCar.slug}`} className="block">
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src={simCar.images[0]?.image_url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"}
                        alt={simCar.variant || "Car"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 text-slate-900">
                      <h4 className="font-bold text-base">{simCar.year} {simCar.make?.name} {simCar.model?.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{formatKM(simCar.mileage)} • {simCar.fuel_type}</p>
                      <div className="text-lg font-black text-[#ED0000] mt-2">
                        {formatPriceINR(simCar.price)}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Vehicle Enquiry Modal */}
      {isEnquiryOpen && (
        <EnquiryModal
          vehicle={vehicle}
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
        />
      )}
    </div>
  );
}
