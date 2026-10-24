"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText, Plus, Search, Filter, Download, Eye, Printer,
  ShieldCheck, TrendingDown, Users, Clock, CheckCircle2, AlertCircle, RefreshCw
} from "lucide-react";

interface Agreement {
  id: string;
  deed_type: "PURCHASE" | "SALE";
  deed_number: string;
  deed_date: string;
  party_name: string;
  party_mobile: string;
  reg_number: string;
  make_model: string;
  total_price: number;
  rc_transfer_status: "PENDING" | "AT_RTO" | "COMPLETED";
  created_at: string;
}

const RC_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: { label: "RC Pending", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  AT_RTO: { label: "At RTO", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  COMPLETED: { label: "RC Done", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
};

const DEED_BADGE: Record<string, { label: string; className: string }> = {
  PURCHASE: { label: "क्रय विलेख", className: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  SALE: { label: "विक्रय विलेख", className: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
};

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default function AdminDeedsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterRC, setFilterRC] = useState("");

  const fetchAgreements = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterType) params.set("type", filterType);
    if (filterRC) params.set("rc_status", filterRC);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/agreements?${params.toString()}`);
    const json = await res.json();
    setAgreements(json.data ?? []);
    setLoading(false);
  }, [search, filterType, filterRC]);

  useEffect(() => { fetchAgreements(); }, [fetchAgreements]);

  const stats = {
    total: agreements.length,
    sales: agreements.filter(a => a.deed_type === "SALE").length,
    purchases: agreements.filter(a => a.deed_type === "PURCHASE").length,
    rcPending: agreements.filter(a => a.rc_transfer_status === "PENDING").length,
  };

  async function updateRCStatus(id: string, rc_transfer_status: string) {
    await fetch(`/api/admin/agreements/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rc_transfer_status }),
    });
    fetchAgreements();
  }

  async function downloadCSV() {
    const headers = ["Deed No", "Type", "Date", "Party", "Mobile", "Reg. No.", "Car", "Price", "RC Status"];
    const rows = agreements.map(a => [
      a.deed_number, a.deed_type, a.deed_date, a.party_name, a.party_mobile,
      a.reg_number, a.make_model, a.total_price, a.rc_transfer_status
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `NSCB-Deeds-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-[#070C1A] text-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ED0000] uppercase tracking-widest mb-1">
            <FileText className="w-4 h-4" />
            <span>विलेख प्रबंधन</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Deeds & Customer Register</h1>
          <p className="text-slate-400 text-xs mt-1">मोटर वाहन क्रय / विक्रय विलेख — Digital Ledger</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-[#1A2639] hover:bg-[#223050] border border-[#273549] text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <Link
            href="/admin/deeds/new"
            className="flex items-center gap-2 bg-[#ED0000] hover:bg-[#D10000] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-red-950/30"
          >
            <Plus className="w-4 h-4" />
            <span>New Deed</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Deeds", value: stats.total, icon: FileText, color: "text-slate-300", bg: "bg-slate-500/10" },
          { label: "Sale Deeds (विक्रय)", value: stats.sales, icon: TrendingDown, color: "text-rose-400", bg: "bg-rose-500/10" },
          { label: "Purchase Deeds (क्रय)", value: stats.purchases, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "RC Transfer Pending", value: stats.rcPending, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((s, i) => (
          <div key={i} className="bg-[#0F1828] border border-[#1E2D42] rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0F1828] border border-[#1E2D42] rounded-2xl p-4 sm:p-5 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, mobile, reg. no…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#162032] border border-[#273549] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] placeholder:text-slate-500"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-[#162032] border border-[#273549] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="SALE">विक्रय (Sale)</option>
            <option value="PURCHASE">क्रय (Purchase)</option>
          </select>
          <select
            value={filterRC}
            onChange={e => setFilterRC(e.target.value)}
            className="bg-[#162032] border border-[#273549] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] cursor-pointer"
          >
            <option value="">All RC Status</option>
            <option value="PENDING">RC Pending</option>
            <option value="AT_RTO">At RTO</option>
            <option value="COMPLETED">RC Completed</option>
          </select>
          <button
            onClick={fetchAgreements}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E293B] border border-[#273549] text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0F1828] border border-[#1E2D42] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-[#ED0000] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading deeds…
          </div>
        ) : agreements.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <div className="font-bold text-white text-base mb-1">No deeds found</div>
            <p className="text-xs">Create your first Sale or Purchase Deed</p>
            <Link href="/admin/deeds/new" className="inline-flex items-center gap-2 mt-4 bg-[#ED0000] hover:bg-[#D10000] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition">
              <Plus className="w-4 h-4" /> New Deed
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2D42] text-slate-400 text-xs uppercase tracking-wider">
                  {["Deed No.", "Type", "Date", "Party Name", "Mobile", "Vehicle", "Reg. No.", "Amount", "RC Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agreements.map((a, i) => {
                  const db = DEED_BADGE[a.deed_type];
                  const rb = RC_BADGE[a.rc_transfer_status];
                  return (
                    <tr key={a.id} className={`border-b border-[#162032] hover:bg-[#162032]/60 transition ${i % 2 === 0 ? "" : "bg-[#0D1625]/40"}`}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-300 whitespace-nowrap">
                        {a.deed_number || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${db.className}`}>
                          {db.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap text-xs">
                        {new Date(a.deed_date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{a.party_name}</td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{a.party_mobile}</td>
                      <td className="px-4 py-3 text-slate-200 text-xs whitespace-nowrap">{a.make_model}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-300">{a.reg_number}</td>
                      <td className="px-4 py-3 font-bold text-white whitespace-nowrap">
                        {formatINR(a.total_price)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={a.rc_transfer_status}
                          onChange={e => updateRCStatus(a.id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-lg border bg-transparent cursor-pointer focus:outline-none ${rb.className}`}
                        >
                          <option value="PENDING">RC Pending</option>
                          <option value="AT_RTO">At RTO</option>
                          <option value="COMPLETED">RC Done</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/deeds/${a.id}/print`}
                            target="_blank"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A2639] hover:bg-[#273549] text-slate-300 hover:text-white transition"
                            title="Print Deed"
                          >
                            <Printer className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/deeds/${a.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1A2639] hover:bg-[#273549] text-slate-300 hover:text-white transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RC Pending Alert */}
      {stats.rcPending > 0 && (
        <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300 text-sm">
              {stats.rcPending} RC Transfer{stats.rcPending > 1 ? "s" : ""} Pending
            </div>
            <div className="text-amber-400/80 text-xs mt-0.5">
              Buyers must transfer RC within 30 days of delivery. Review and follow up with customers.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
