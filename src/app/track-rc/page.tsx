"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  Car,
  FileText,
  AlertCircle,
  HelpCircle,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface TimelineStep {
  step: number;
  title: string;
  description: string;
  completed: boolean;
  date?: string | null;
  receipt?: string | null;
}

interface RCData {
  deed_number: string;
  deed_date: string;
  make_model: string;
  reg_number: string;
  reg_rto: string;
  rc_transfer_status: "PENDING" | "AT_RTO" | "COMPLETED";
  rto_receipt_no?: string | null;
  rc_transfer_date?: string | null;
  steps: TimelineStep[];
}

export default function TrackRcPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [rcData, setRcData] = useState<RCData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setErrorMsg("Please enter a vehicle registration number or deed number.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSearched(true);

    try {
      const res = await fetch(`/api/track-rc?q=${encodeURIComponent(query.trim())}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to search RC status");
      }

      if (json.found && json.data) {
        setRcData(json.data);
      } else {
        setRcData(null);
        setErrorMsg(json.message || "No record found matching this query.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
      setRcData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          text: "RC Transfer Complete",
          bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        };
      case "AT_RTO":
        return {
          text: "Submitted at RTO Office",
          bg: "bg-blue-500/15 border-blue-500/30 text-blue-400",
        };
      default:
        return {
          text: "Document Processing",
          bg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-[#ED0000] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Customer Service Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Live RC Transfer Status Tracker
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Track real-time RTO ownership transfer progress for vehicles purchased from or sold to New Sai Car Bazar, Barabanki.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-xs sm:text-sm font-semibold text-slate-300">
              Enter Vehicle Registration Number or Deed Number
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value.toUpperCase())}
                  placeholder="e.g. UP 32 AB 1234 or NSCB-VIKRAY-2026-001"
                  className="w-full bg-[#162032] border border-[#273549] rounded-xl pl-12 pr-4 py-3.5 text-sm sm:text-base font-mono uppercase text-white placeholder-slate-500 focus:outline-none focus:border-[#ED0000] transition"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#ED0000] hover:bg-[#D10000] disabled:bg-slate-700 text-white font-bold px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg shadow-red-900/30"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Track Status</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Tip: You can search using with or without spaces (e.g. &ldquo;UP32AB1234&rdquo; or &ldquo;UP 32 AB 1234&rdquo;)</span>
            </div>
          </form>

          {/* Error / Not Found Message */}
          {errorMsg && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-400 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold">Record Not Found</div>
                <div>{errorMsg}</div>
                <div className="pt-2">
                  <a
                    href="https://wa.me/918172946630?text=Hello%20New%20Sai%20Car%20Bazar,%20I%20am%20checking%20my%20RC%20transfer%20status."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 font-bold hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Contact Showroom RC Coordinator on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Card */}
        {rcData && (
          <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in duration-300">
            {/* Top Vehicle Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2D42]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#ED0000]" />
                  <h2 className="text-xl sm:text-2xl font-black text-white">{rcData.make_model}</h2>
                </div>
                <div className="font-mono text-slate-300 text-sm font-semibold">
                  Registration No: <span className="text-white font-bold">{rcData.reg_number}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Deed No: <span className="font-mono text-slate-300">{rcData.deed_number}</span> • RTO: {rcData.reg_rto}
                </div>
              </div>

              <div className="shrink-0">
                {(() => {
                  const badge = getStatusBadge(rcData.rc_transfer_status);
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-bold ${badge.bg}`}>
                      {rcData.rc_transfer_status === "COMPLETED" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                      <span>{badge.text}</span>
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span>RC Transfer Milestones</span>
              </h3>

              <div className="space-y-6">
                {rcData.steps.map((step, idx) => {
                  const isLast = idx === rcData.steps.length - 1;

                  return (
                    <div key={step.step} className="flex items-start gap-4 relative">
                      {/* Connecting Line */}
                      {!isLast && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-16 ${
                            step.completed ? "bg-emerald-500" : "bg-[#273549]"
                          }`}
                        />
                      )}

                      {/* Step Circle */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 transition ${
                          step.completed
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-900/30"
                            : "bg-[#162032] border-[#273549] text-slate-500"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{step.step}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4
                            className={`font-bold text-sm sm:text-base ${
                              step.completed ? "text-white" : "text-slate-400"
                            }`}
                          >
                            {step.title}
                          </h4>
                          {step.date && (
                            <span className="text-[11px] font-mono text-slate-400">
                              {step.date}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                        {step.receipt && (
                          <div className="mt-2 inline-block bg-[#162032] border border-[#273549] px-2.5 py-1 rounded text-xs font-mono text-amber-300">
                            RTO Receipt No: {step.receipt}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support Assistance Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#162032] border border-[#273549] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">Have Questions Regarding Transfer?</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Our dedicated RTO documentation team is at your service 7 days a week.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="tel:+918858982362"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#273549] hover:bg-[#34455E] text-white text-xs font-semibold transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call RTO Desk</span>
                </a>
                <a
                  href={`https://wa.me/918172946630?text=Hello%20New%20Sai%20Car%20Bazar,%20I%20am%20enquiring%20about%20RC%20transfer%20for%20vehicle%20${rcData.reg_number}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-900/30"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* FAQs */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#ED0000]" />
            <span>Frequently Asked Questions (RTO Ownership Transfer)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
            <div className="space-y-1.5 p-4 rounded-xl bg-[#162032] border border-[#1E2D42]">
              <div className="font-bold text-white">How long does an RC transfer take in UP?</div>
              <div className="text-slate-400 leading-relaxed">
                Typically, RTO ownership transfer is finalized within 25 to 45 business days depending on document verification and smart card dispatch from the regional transport office.
              </div>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-[#162032] border border-[#1E2D42]">
              <div className="font-bold text-white">What are Form 29 & Form 30?</div>
              <div className="text-slate-400 leading-relaxed">
                Form 29 is the legal notice of vehicle transfer signed by the seller, while Form 30 is the formal application for intimation of transfer submitted to the registering authority.
              </div>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-[#162032] border border-[#1E2D42]">
              <div className="font-bold text-white">Is New Sai Car Bazar handling the full paperwork?</div>
              <div className="text-slate-400 leading-relaxed">
                Yes! Every vehicle purchased or sold through New Sai Car Bazar comes with end-to-end RTO paperwork facilitation managed directly by our showroom liaisons.
              </div>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl bg-[#162032] border border-[#1E2D42]">
              <div className="font-bold text-white">Can I drive the vehicle while transfer is pending?</div>
              <div className="text-slate-400 leading-relaxed">
                Yes. The legal Sale Deed, Delivery Note, and RTO acknowledgment receipt issued by our dealership serve as valid interim authorization along with active insurance and PUC.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
