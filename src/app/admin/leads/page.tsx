"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  BadgePercent,
  DollarSign,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  Car,
} from "lucide-react";
import { DataStore } from "@/lib/data/store";
import { Lead, FinanceLead, SellCarRequest, LeadStatus } from "@/types";
import { formatPriceINR, createWhatsAppUrl, createPhoneCallUrl } from "@/lib/utils";

export default function AdminLeadsPage() {
  const [activeTab, setActiveTab] = useState<'enquiries' | 'finance' | 'sellCar'>('enquiries');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [financeLeads, setFinanceLeads] = useState<FinanceLead[]>([]);
  const [sellRequests, setSellRequests] = useState<SellCarRequest[]>([]);

  const refreshData = () => {
    setLeads(DataStore.getLeads());
    setFinanceLeads(DataStore.getFinanceLeads());
    setSellRequests(DataStore.getSellCarRequests());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleUpdateStatus = (id: string, newStatus: LeadStatus) => {
    if (activeTab === 'enquiries') {
      DataStore.updateLeadStatus(id, newStatus);
    } else if (activeTab === 'finance') {
      DataStore.updateFinanceLeadStatus(id, newStatus);
    } else {
      DataStore.updateSellCarStatus(id, newStatus);
    }
    refreshData();
  };

  const statusOptions: LeadStatus[] = ['NEW', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Customer Leads & Inquiries</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage inquiries, finance applications, and car valuation requests
          </p>
        </div>

        {/* 3 Tabs */}
        <div className="flex items-center bg-[#0F1827] border border-[#273549] p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? "bg-[#ED0000] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Enquiries ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              activeTab === 'finance'
                ? "bg-[#ED0000] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BadgePercent className="w-4 h-4" />
            <span>Finance ({financeLeads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sellCar')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              activeTab === 'sellCar'
                ? "bg-[#ED0000] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Sell Car ({sellRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Leads Content */}
      <div className="space-y-4">
        {/* Tab 1: General Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {leads.length === 0 ? (
              <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-12 text-center text-slate-400">
                No customer inquiries yet.
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-600 transition"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{lead.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          lead.status === 'NEW'
                            ? "bg-[#ED0000]/20 text-[#ED0000] border border-red-500/30"
                            : lead.status === 'CONVERTED'
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-[#ED0000]" />
                      <span>{lead.vehicle_name || "General Used Car Enquiry"}</span>
                    </div>

                    {lead.message && (
                      <p className="text-xs text-slate-400 italic bg-[#162032] p-3 rounded-lg border border-[#273549]">
                        "{lead.message}"
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span>Source: {lead.source}</span>
                      <span>•</span>
                      <span>Received: {new Date(lead.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Actions & Status Control */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#1E293B]">
                    <div className="flex items-center gap-2">
                      <a
                        href={createWhatsAppUrl(`+91${lead.phone}`, `Hello ${lead.name}, regarding your car inquiry at New Sai Car Bazar:`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={createPhoneCallUrl(lead.phone)}
                        className="bg-[#162032] hover:bg-[#1E293B] border border-[#273549] text-white p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
                        title="Call Customer"
                      >
                        <Phone className="w-4 h-4 text-[#ED0000]" />
                        <span>{lead.phone}</span>
                      </a>
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                      className="bg-[#162032] text-white border border-[#273549] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#ED0000]"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Finance Applications */}
        {activeTab === 'finance' && (
          <div className="space-y-4">
            {financeLeads.length === 0 ? (
              <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-12 text-center text-slate-400">
                No finance applications yet.
              </div>
            ) : (
              financeLeads.map((fLead) => (
                <div
                  key={fLead.id}
                  className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{fLead.name}</h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {fLead.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#162032] p-3 rounded-xl border border-[#273549] text-xs">
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Vehicle</div>
                        <div className="font-bold text-white truncate">{fLead.vehicle_name || "General"}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Loan Required</div>
                        <div className="font-bold text-[#ED0000]">{formatPriceINR(fLead.loan_amount)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Monthly EMI</div>
                        <div className="font-bold text-white">₹{fLead.estimated_emi.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Tenure / Rate</div>
                        <div className="font-bold text-white">{fLead.tenure} Mos @ {fLead.interest_rate}%</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400">
                      Profile: <strong>{fLead.employment_type || "Salaried"}</strong> • Monthly Income: <strong>{formatPriceINR(fLead.monthly_income || 0)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={createWhatsAppUrl(`+91${fLead.phone}`, `Hello ${fLead.name}, this is New Sai Car Bazar regarding your loan application for ${fLead.vehicle_name}:`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={createPhoneCallUrl(fLead.phone)}
                      className="bg-[#162032] hover:bg-[#1E293B] border border-[#273549] text-white p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Phone className="w-4 h-4 text-[#ED0000]" />
                      <span>{fLead.phone}</span>
                    </a>
                    <select
                      value={fLead.status}
                      onChange={(e) => handleUpdateStatus(fLead.id, e.target.value as LeadStatus)}
                      className="bg-[#162032] text-white border border-[#273549] rounded-xl px-3 py-2 text-xs font-semibold"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Sell Car Requests */}
        {activeTab === 'sellCar' && (
          <div className="space-y-4">
            {sellRequests.length === 0 ? (
              <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-12 text-center text-slate-400">
                No car selling requests yet.
              </div>
            ) : (
              sellRequests.map((sReq) => (
                <div
                  key={sReq.id}
                  className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{sReq.name} ({sReq.city})</h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {sReq.status}
                      </span>
                    </div>

                    <div className="text-sm font-black text-[#ED0000]">
                      {sReq.year} {sReq.make} {sReq.model}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#162032] p-3 rounded-xl border border-[#273549] text-xs">
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Kilometers</div>
                        <div className="font-bold text-white">{sReq.mileage} km</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Fuel / Gear</div>
                        <div className="font-bold text-white">{sReq.fuel_type || "Petrol"} • {sReq.transmission || "Manual"}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Reg Number</div>
                        <div className="font-bold text-white">{sReq.registration || "UP"}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Expected Price</div>
                        <div className="font-bold text-emerald-400">{formatPriceINR(sReq.expected_price || 0)}</div>
                      </div>
                    </div>

                    {sReq.description && (
                      <p className="text-xs text-slate-400 italic">
                        "{sReq.description}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={createWhatsAppUrl(`+91${sReq.phone}`, `Hello ${sReq.name}, regarding your ${sReq.year} ${sReq.make} ${sReq.model} valuation request:`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={createPhoneCallUrl(sReq.phone)}
                      className="bg-[#162032] hover:bg-[#1E293B] border border-[#273549] text-white p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Phone className="w-4 h-4 text-[#ED0000]" />
                      <span>{sReq.phone}</span>
                    </a>
                    <select
                      value={sReq.status}
                      onChange={(e) => handleUpdateStatus(sReq.id, e.target.value as LeadStatus)}
                      className="bg-[#162032] text-white border border-[#273549] rounded-xl px-3 py-2 text-xs font-semibold"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
