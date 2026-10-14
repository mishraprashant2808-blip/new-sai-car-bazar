"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Printer, Car, User, CreditCard, Clock, CheckCircle2,
  AlertCircle, Edit, Trash2, FileText
} from "lucide-react";

interface Agreement {
  id: string;
  deed_type: "PURCHASE" | "SALE";
  deed_number: string;
  deed_date: string;
  party_name: string;
  party_relation_type: string;
  party_relation_name: string;
  party_address: string;
  party_mobile: string;
  party_id_type: string;
  party_id_number: string;
  make_model: string;
  variant: string;
  color: string;
  mfg_year: number;
  reg_year: number;
  reg_number: string;
  fuel_type: string;
  chassis_number: string;
  engine_number: string;
  odometer_reading: number;
  reg_rto: string;
  insurance_policy_no: string;
  insurance_validity: string;
  puc_number: string;
  puc_validity: string;
  total_price: number;
  total_price_words: string;
  advance_amount: number;
  balance_amount: number;
  payment_mode_1: string;
  payment_ref_1: string;
  payment_date_1: string;
  rc_transfer_status: "PENDING" | "AT_RTO" | "COMPLETED";
  form29_received: boolean;
  form30_received: boolean;
  rc_transfer_date: string;
  notes: string;
  created_at: string;
}

const RC_STEPS = [
  { key: "PENDING",   label: "RC Pending",  desc: "Awaiting initiation" },
  { key: "AT_RTO",    label: "At RTO",       desc: "Documents submitted to RTO" },
  { key: "COMPLETED", label: "RC Completed", desc: "Transfer complete" },
];

export default function DeedDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rcStatus, setRcStatus] = useState("PENDING");
  const [form29, setForm29] = useState(false);
  const [form30, setForm30] = useState(false);
  const [rtoReceipt, setRtoReceipt] = useState("");

  const fetchDeed = useCallback(async () => {
    const res = await fetch(`/api/admin/agreements/${params.id}`);
    const json = await res.json();
    if (json.data) {
      setData(json.data);
      setRcStatus(json.data.rc_transfer_status);
      setForm29(json.data.form29_received ?? false);
      setForm30(json.data.form30_received ?? false);
      setRtoReceipt(json.data.rto_receipt_no ?? "");
    }
    setLoading(false);
  }, [params.id]);

  useEffect(() => { fetchDeed(); }, [fetchDeed]);

  async function saveRCStatus() {
    setSaving(true);
    await fetch(`/api/admin/agreements/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rc_transfer_status: rcStatus,
        form29_received: form29,
        form30_received: form30,
        rto_receipt_no: rtoReceipt,
        ...(rcStatus === "COMPLETED" ? { rc_transfer_date: new Date().toISOString().slice(0, 10) } : {}),
      }),
    });
    setSaving(false);
    fetchDeed();
  }

  async function deleteDeed() {
    if (!confirm("Are you sure you want to delete this deed? This action cannot be undone.")) return;
    await fetch(`/api/admin/agreements/${params.id}`, { method: "DELETE" });
    router.push("/admin/deeds");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070C1A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ED0000] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-red-400">Deed not found.</div>;

  const isSale = data.deed_type === "SALE";
  const currentStep = RC_STEPS.findIndex(s => s.key === rcStatus);

  return (
    <div className="min-h-screen bg-[#070C1A] text-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/deeds" className="w-9 h-9 rounded-xl bg-[#1A2639] hover:bg-[#273549] flex items-center justify-center transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{data.deed_number}</h1>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${isSale ? "text-rose-400 border-rose-500/30 bg-rose-500/10" : "text-purple-400 border-purple-500/30 bg-purple-500/10"}`}>
                {isSale ? "विक्रय विलेख" : "क्रय विलेख"}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">{new Date(data.created_at).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/deeds/${data.id}/print`}
            target="_blank"
            className="flex items-center gap-2 bg-[#1A2639] hover:bg-[#273549] border border-[#273549] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <Printer className="w-4 h-4" />
            Print Deed
          </Link>
          <button
            onClick={deleteDeed}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl space-y-6">
        {/* Top Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0F1828] border border-[#1E2D42] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-[#ED0000]" />
              <span className="text-xs font-bold text-slate-400 uppercase">{isSale ? "Buyer" : "Seller"}</span>
            </div>
            <div className="font-black text-white text-lg">{data.party_name}</div>
            <div className="text-slate-400 text-xs mt-1">{data.party_mobile}</div>
            <div className="text-slate-500 text-xs mt-0.5 truncate">{data.party_address}</div>
          </div>
          <div className="bg-[#0F1828] border border-[#1E2D42] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-4 h-4 text-[#ED0000]" />
              <span className="text-xs font-bold text-slate-400 uppercase">Vehicle</span>
            </div>
            <div className="font-black text-white text-lg">{data.make_model}</div>
            <div className="font-mono text-slate-300 text-sm mt-1">{data.reg_number}</div>
            <div className="text-slate-500 text-xs mt-0.5">{data.color} • {data.fuel_type} • {data.odometer_reading?.toLocaleString("en-IN")} km</div>
          </div>
          <div className="bg-[#0F1828] border border-[#1E2D42] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-[#ED0000]" />
              <span className="text-xs font-bold text-slate-400 uppercase">Amount</span>
            </div>
            <div className="font-black text-white text-2xl">
              ₹{data.total_price?.toLocaleString("en-IN")}
            </div>
            <div className="text-slate-400 text-xs mt-1">{data.total_price_words}</div>
            <div className="text-slate-500 text-xs mt-0.5">{data.payment_mode_1}</div>
          </div>
        </div>

        {/* RC Transfer Tracker */}
        <div className="bg-[#0F1828] border border-[#1E2D42] rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-black text-white flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-amber-400" />
            RC Transfer Tracker
          </h2>

          {/* Progress Stepper */}
          <div className="flex items-start gap-0 mb-8">
            {RC_STEPS.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                  {i < RC_STEPS.length - 1 && (
                    <div className={`absolute top-4 left-1/2 w-full h-0.5 ${done && i < currentStep ? "bg-emerald-500" : "bg-[#1E2D42]"}`} />
                  )}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition ${
                    done ? (active ? "border-amber-400 bg-amber-500/20" : "border-emerald-500 bg-emerald-500/20") : "border-[#273549] bg-[#0A1520]"
                  }`}>
                    {done && !active ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-xs font-bold text-slate-300">{i + 1}</span>}
                  </div>
                  <div className={`text-xs font-bold mt-2 text-center ${done ? (active ? "text-amber-400" : "text-emerald-400") : "text-slate-500"}`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-slate-600 text-center mt-0.5 px-1">{step.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Update RC Status */}
          <div className="bg-[#0A1520] border border-[#1E2D42] rounded-xl p-4 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase">Update RC Status</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">RC Transfer Status</label>
                <select
                  value={rcStatus}
                  onChange={e => setRcStatus(e.target.value)}
                  className="w-full bg-[#162032] border border-[#273549] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] cursor-pointer"
                >
                  <option value="PENDING">RC Pending</option>
                  <option value="AT_RTO">At RTO Office</option>
                  <option value="COMPLETED">RC Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">RTO Receipt / Acknowledgement No.</label>
                <input
                  type="text"
                  value={rtoReceipt}
                  onChange={e => setRtoReceipt(e.target.value)}
                  placeholder="RTO Receipt Number"
                  className="w-full bg-[#162032] border border-[#273549] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form29} onChange={e => setForm29(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                <span className="text-sm text-slate-300">Form 29 Received</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form30} onChange={e => setForm30(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                <span className="text-sm text-slate-300">Form 30 Submitted</span>
              </label>
            </div>
            <button
              onClick={saveRCStatus}
              disabled={saving}
              className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-5 py-2.5 rounded-xl transition"
            >
              {saving ? <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Save RC Status
            </button>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-[#0F1828] border border-[#1E2D42] rounded-2xl p-6">
          <h2 className="text-base font-black text-white flex items-center gap-2 mb-4 pb-3 border-b border-[#1E2D42]">
            <Car className="w-4 h-4 text-[#ED0000]" />
            वाहन विवरण
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              ["Chassis No.", data.chassis_number],
              ["Engine No.", data.engine_number],
              ["Reg. No.", data.reg_number],
              ["Color", data.color],
              ["Fuel Type", data.fuel_type],
              ["Odometer", data.odometer_reading ? `${data.odometer_reading.toLocaleString("en-IN")} km` : "—"],
              ["Mfg Year", data.mfg_year || "—"],
              ["Reg Year", data.reg_year || "—"],
              ["RTO", data.reg_rto || "—"],
              ["Insurance", [data.insurance_policy_no, data.insurance_validity].filter(Boolean).join(" — ") || "—"],
              ["PUC", data.puc_number || "—"],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
                <div className="text-sm text-white font-medium mt-0.5 break-all">{value || "—"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
            <div className="text-xs font-bold text-amber-400 uppercase mb-1">Notes / टिप्पणी</div>
            <div className="text-sm text-slate-300">{data.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
