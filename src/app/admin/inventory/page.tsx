"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  PlusCircle,
  FileSpreadsheet,
  Search,
  Star,
  Flame,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { DataStore } from "@/lib/data/store";
import { Vehicle } from "@/types";
import { formatPriceINR, formatKM } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const refreshVehicles = () => {
    setVehicles(DataStore.getAllVehiclesAdmin());
  };

  useEffect(() => {
    refreshVehicles();
  }, []);

  const handleToggleStatus = (id: string, currentStatus: Vehicle['status']) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE';
    DataStore.updateVehicle(id, { status: nextStatus });
    refreshVehicles();
  };

  const handleToggleFeatured = (id: string, current: boolean) => {
    DataStore.updateVehicle(id, { is_featured: !current });
    refreshVehicles();
  };

  const handleToggleNewArrival = (id: string, current: boolean) => {
    DataStore.updateVehicle(id, { is_new_arrival: !current });
    refreshVehicles();
  };

  const handleToggleHotDeal = (id: string, current: boolean) => {
    DataStore.updateVehicle(id, { is_hot_deal: !current });
    refreshVehicles();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from inventory?`)) {
      DataStore.deleteVehicle(id);
      refreshVehicles();
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.variant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.make?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.stock_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Manage Vehicles</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Active dealership inventory control for New Sai Car Bazar (Barabanki)
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

      {/* Filter & Search Bar */}
      <div className="bg-[#0F1827] border border-[#273549] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stock #, make, model..."
            className="w-full bg-[#162032] text-xs sm:text-sm text-white border border-[#273549] rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#ED0000]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#162032] text-white border border-[#273549] rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#ED0000]"
          >
            <option value="all">All Vehicles</option>
            <option value="AVAILABLE">Available</option>
            <option value="SOLD">Sold</option>
            <option value="RESERVED">Reserved</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#0F1827] border border-[#273549] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#121B2A] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#273549]">
              <tr>
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Price & Year</th>
                <th className="py-3.5 px-4">Specs</th>
                <th className="py-3.5 px-4 text-center">Badges</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {filteredVehicles.map((vehicle) => {
                const title = `${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name}`;
                return (
                  <tr key={vehicle.id} className="hover:bg-[#162032]/50 transition">
                    {/* Vehicle */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-11 rounded-lg bg-slate-800 overflow-hidden relative shrink-0">
                          <img
                            src={vehicle.images[0]?.image_url || "/placeholder.jpg"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{title}</div>
                          <div className="text-[11px] text-slate-400">{vehicle.variant}</div>
                          <div className="text-[10px] font-mono text-slate-500">{vehicle.stock_number}</div>
                        </div>
                      </div>
                    </td>

                    {/* Price & Year */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">
                        {formatPriceINR(vehicle.price)}
                      </div>
                      <div className="text-[11px] text-slate-400">Year: {vehicle.year}</div>
                    </td>

                    {/* Specs */}
                    <td className="py-3 px-4">
                      <div className="text-slate-300 font-medium">{formatKM(vehicle.mileage)}</div>
                      <div className="text-[11px] text-slate-400">
                        {vehicle.fuel_type} • {vehicle.transmission}
                      </div>
                    </td>

                    {/* Badges Toggles */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleToggleFeatured(vehicle.id, vehicle.is_featured)}
                          className={`p-1.5 rounded transition ${
                            vehicle.is_featured
                              ? "bg-amber-500/20 text-amber-400"
                              : "text-slate-600 hover:text-slate-400"
                          }`}
                          title="Toggle Featured"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>

                        <button
                          onClick={() => handleToggleNewArrival(vehicle.id, vehicle.is_new_arrival)}
                          className={`p-1.5 rounded transition ${
                            vehicle.is_new_arrival
                              ? "bg-blue-500/20 text-blue-400"
                              : "text-slate-600 hover:text-slate-400"
                          }`}
                          title="Toggle New Arrival"
                        >
                          <Clock className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleHotDeal(vehicle.id, vehicle.is_hot_deal)}
                          className={`p-1.5 rounded transition ${
                            vehicle.is_hot_deal
                              ? "bg-red-500/20 text-[#ED0000]"
                              : "text-slate-600 hover:text-slate-400"
                          }`}
                          title="Toggle Hot Deal"
                        >
                          <Flame className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full transition cursor-pointer ${
                          vehicle.status === "AVAILABLE"
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                        }`}
                      >
                        {vehicle.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/inventory/${vehicle.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-white rounded"
                          title="View on public site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(vehicle.id, title)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded"
                          title="Delete vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
