"use client";

import React, { useState } from "react";
import { Car, Upload, CheckCircle2, Send, ShieldCheck, DollarSign, Clock, HelpCircle } from "lucide-react";
import { DataStore } from "@/lib/data/store";
import { sellCarSchema } from "@/lib/validation/sell-car";

export default function SellMyCarPage() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number>(2020);
  const [mileage, setMileage] = useState<number>(45000);
  const [fuelType, setFuelType] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [registration, setRegistration] = useState("");
  const [expectedPrice, setExpectedPrice] = useState<number>(500000);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Barabanki");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const validation = sellCarSchema.safeParse({
      make,
      model,
      year: Number(year),
      mileage: Number(mileage),
      fuel_type: fuelType,
      transmission,
      registration,
      expected_price: Number(expectedPrice),
      name,
      phone,
      email: email || undefined,
      city,
      description,
    });

    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message || "Please check the form fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sell-my-car", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make,
          model,
          year: Number(year),
          mileage: Number(mileage),
          fuel_type: fuelType,
          transmission,
          registration,
          expected_price: Number(expectedPrice),
          name,
          phone,
          email: email || undefined,
          city,
          description,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to submit");
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit sell request. Please contact our showroom directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0A0F1D] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-[#ED0000] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <DollarSign className="w-4 h-4" />
            <span>Instant Valuation & Same-Day Payment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Sell Your Car in Barabanki
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Get the highest market offer for your used car. Free doorstep physical evaluation, zero RC transfer hassle, and immediate payment.
          </p>
        </div>

        {/* 3 Step Benefits Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#121B2A] border border-[#273549] p-5 rounded-xl text-center">
            <div className="w-10 h-10 rounded-full bg-[#ED0000]/10 text-[#ED0000] font-black flex items-center justify-center mx-auto mb-2 text-base">
              1
            </div>
            <h4 className="font-bold text-sm text-white">Share Car Details</h4>
            <p className="text-xs text-slate-400 mt-1">Fill out the quick 2-minute form below</p>
          </div>

          <div className="bg-[#121B2A] border border-[#273549] p-5 rounded-xl text-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 font-black flex items-center justify-center mx-auto mb-2 text-base">
              2
            </div>
            <h4 className="font-bold text-sm text-white">Free Doorstep Inspection</h4>
            <p className="text-xs text-slate-400 mt-1">Our certified technician inspects your vehicle</p>
          </div>

          <div className="bg-[#121B2A] border border-[#273549] p-5 rounded-xl text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 font-black flex items-center justify-center mx-auto mb-2 text-base">
              3
            </div>
            <h4 className="font-bold text-sm text-white">Instant Payment</h4>
            <p className="text-xs text-slate-400 mt-1">Get money directly in your bank account</p>
          </div>
        </div>

        {/* Valuation Request Form */}
        <div className="bg-[#121B2A] border border-[#273549] rounded-2xl p-6 sm:p-10 shadow-2xl">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white">Car Valuation Request Received!</h2>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                Thank you <strong>{name}</strong>. Our vehicle acquisition specialist at New Sai Car Bazar will call you on <strong>{phone}</strong> to confirm your vehicle evaluation appointment.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-6 bg-[#ED0000] hover:bg-[#D10000] text-white text-xs font-bold px-6 py-2.5 rounded-lg transition"
              >
                Submit Another Vehicle
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              {/* Section 1: Vehicle Information */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 pb-2 border-b border-[#1E293B]">
                  <Car className="w-5 h-5 text-[#ED0000]" />
                  <span>1. Vehicle Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Make / Brand *</label>
                    <input
                      type="text"
                      required
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      placeholder="e.g. Maruti, Hyundai, Toyota"
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Model & Variant *</label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. Swift VXI, Creta SX"
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Manufacturing Year *</label>
                    <input
                      type="number"
                      required
                      min={1995}
                      max={new Date().getFullYear()}
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
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
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fuel Type</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Transmission</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Registration State / No</label>
                    <input
                      type="text"
                      value={registration}
                      onChange={(e) => setRegistration(e.target.value)}
                      placeholder="e.g. UP 32 XX 1234 or UP 41"
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Price (₹)</label>
                    <input
                      type="number"
                      min={10000}
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(Number(e.target.value))}
                      placeholder="e.g. 450000"
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Owner Contact Details */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 pb-2 border-b border-[#1E293B]">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>2. Owner Contact Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">City / Location</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Barabanki, Lucknow, etc."
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Condition Notes</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. 1st Owner, non-accidental, comprehensive insurance valid, recent service done..."
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-4 rounded-xl text-base transition flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-red-950/50"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? "Submitting Valuation Request..." : "Get Instant Car Valuation Offer"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
