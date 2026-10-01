"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2, Phone, User, Mail, MessageSquare } from "lucide-react";
import { Vehicle } from "@/types";
import { DataStore } from "@/lib/data/store";
import { leadSchema } from "@/lib/validation/lead";

interface EnquiryModalProps {
  vehicle?: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ vehicle, isOpen, onClose }: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    vehicle
      ? `I am interested in scheduling a test drive for the ${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name} (${vehicle.variant}).`
      : "I would like to enquire about used car availability."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const validation = leadSchema.safeParse({
      name,
      phone,
      email: email || undefined,
      message,
      vehicle_id: vehicle?.id,
      source: "website_enquiry_modal",
    });

    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message || "Please check your input.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicle?.id,
          name,
          phone,
          email: email || undefined,
          message,
          source: "website_enquiry_modal",
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to submit");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit enquiry. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0F1827] text-white rounded-2xl border border-[#273549] shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Enquiry Received!</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thank you {name}. Our sales manager at New Sai Car Bazar will call you shortly on <strong>{phone}</strong> to schedule your test drive.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold text-[#ED0000] uppercase tracking-wider">
                Direct Dealership Enquiry
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                {vehicle ? `Test Drive: ${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name}` : "Car Enquiry"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                No spam. We will contact you directly from our Barabanki showroom.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Message / Preferred Inspection Time
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ED0000] hover:bg-[#D10000] disabled:opacity-50 text-white font-bold py-3 rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting..." : "Submit Enquiry"}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
