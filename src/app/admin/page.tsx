"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  PlusCircle,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Phone,
  MessageCircle,
} from "lucide-react";
import { DataStore } from "@/lib/data/store";
import { Vehicle, Lead } from "@/types";
import { formatPriceINR, formatKM, createWhatsAppUrl, createPhoneCallUrl } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [financeCount, setFinanceCount] = useState(0);
  const [sellCarCount, setSellCarCount] = useState(0);

  useEffect(() => {
    setVehicles(DataStore.getAllVehiclesAdmin());
    setLeads(DataStore.getLeads());
    setFinanceCount(DataStore.getFinanceLeads().length);
    setSellCarCount(DataStore.getSellCarRequests().length);
  }, []);

  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const soldVehicles = vehicles.filter((v) => v.status === "SOLD").length;
  const featuredVehicles = vehicles.filter((v) => v.is_featured).length;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Dealership Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time status of inventory, inquiries, and vehicle valuations in Barabanki
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory/new"
            className="bg-[#ED0000] hover:bg-[#D10000] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-2 shadow-lg shadow-red-950/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Vehicle</span>
          </Link>
          <Link
            href="/admin/inventory/import"
            className="bg-[#162032] hover:bg-[#1E293B] text-slate-200 border border-[#273549] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV Import</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Available Cars */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Available Cars</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-3">
            {availableVehicles}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Out of <strong>{totalVehicles}</strong> total stock
          </div>
        </div>

        {/* Card 2: Sold Vehicles */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Sold Units</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-3">
            {soldVehicles}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Delivered successfully</div>
        </div>

        {/* Card 3: Featured Listings */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Featured Cars</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-3">
            {featuredVehicles}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Showcased on homepage</div>
        </div>

        {/* Card 4: Total Customer Leads */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-[#ED0000] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#ED0000] mt-3">
            {leads.length + financeCount + sellCarCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {leads.length} Enquiries • {financeCount} Loans • {sellCarCount} Sell Car
          </div>
        </div>
      </div>

      {/* 2 Columns: Recent Enquiries & Recent Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries (6 cols) */}
        <div className="lg:col-span-6 bg-[#0F1827] border border-[#273549] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <h3 className="font-bold text-base text-white">Recent Customer Inquiries</h3>
            <Link href="/admin/leads" className="text-xs font-bold text-[#ED0000] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 bg-[#162032] border border-[#273549] rounded-xl flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-sm text-white">{lead.name}</div>
                  <div className="text-xs text-[#ED0000] font-medium">{lead.vehicle_name || "General Inquiry"}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{lead.message}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={createWhatsAppUrl(`+91${lead.phone}`, `Hello ${lead.name}, thank you for your enquiry at New Sai Car Bazar regarding ${lead.vehicle_name || 'used cars'}. How can we assist you?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href={createPhoneCallUrl(lead.phone)}
                    className="p-2 bg-slate-700/50 text-slate-300 hover:bg-[#ED0000] hover:text-white rounded-lg transition"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inventory Additions (6 cols) */}
        <div className="lg:col-span-6 bg-[#0F1827] border border-[#273549] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <h3 className="font-bold text-base text-white">Live Showroom Inventory</h3>
            <Link href="/admin/inventory" className="text-xs font-bold text-[#ED0000] hover:underline flex items-center gap-1">
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {vehicles.slice(0, 5).map((vehicle) => (
              <div
                key={vehicle.id}
                className="p-3 bg-[#162032] border border-[#273549] rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-10 rounded bg-slate-800 overflow-hidden relative shrink-0">
                    <img
                      src={vehicle.images[0]?.image_url || "/placeholder.jpg"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white truncate">
                      {vehicle.year} {vehicle.make?.name} {vehicle.model?.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {formatKM(vehicle.mileage)} • {vehicle.fuel_type} • {vehicle.transmission}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-black text-sm text-white">
                    {formatPriceINR(vehicle.price)}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                      vehicle.status === "AVAILABLE"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
