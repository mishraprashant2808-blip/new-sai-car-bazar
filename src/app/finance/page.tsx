"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Calculator, ShieldCheck, BadgePercent, CheckCircle2, Send, ArrowRight, HelpCircle } from "lucide-react";
import { calculateEMI, formatPriceINR } from "@/lib/utils";
import { DataStore } from "@/lib/data/store";
import { financeLeadSchema } from "@/lib/validation/finance";

function FinanceCalculatorContent() {
  const searchParams = useSearchParams();
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : 1800000;
  const paramVehicle = searchParams.get("vehicle") || "";

  // Calculator inputs
  const [vehiclePrice, setVehiclePrice] = useState<number>(paramPrice);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [tenureMonths, setTenureMonths] = useState<number>(60);

  // Application form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [employmentType, setEmploymentType] = useState("Salaried");
  const [monthlyIncome, setMonthlyIncome] = useState<number>(75000);
  const [formMsg, setFormMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (searchParams.get("price")) {
      setVehiclePrice(Number(searchParams.get("price")));
    }
  }, [searchParams]);

  // Derived Calculations
  const downPaymentAmount = Math.round((vehiclePrice * downPaymentPct) / 100);
  const loanPrincipal = Math.max(0, vehiclePrice - downPaymentAmount);
  const { monthlyEMI, totalInterest, totalPayable } = calculateEMI(loanPrincipal, interestRate, tenureMonths);

  // Percentages for visual bar chart
  const principalPct = totalPayable > 0 ? Math.round((loanPrincipal / totalPayable) * 100) : 0;
  const interestPct = 100 - principalPct;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const validation = financeLeadSchema.safeParse({
      name,
      phone,
      email: email || undefined,
      vehicle_price: vehiclePrice,
      loan_amount: loanPrincipal,
      down_payment: downPaymentAmount,
      interest_rate: interestRate,
      tenure: tenureMonths,
      estimated_emi: monthlyEMI,
      employment_type: employmentType,
      monthly_income: monthlyIncome,
      message: formMsg || (paramVehicle ? `Finance application for ${paramVehicle}` : undefined),
    });

    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message || "Please verify your input details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          vehicle_price: vehiclePrice,
          loan_amount: loanPrincipal,
          down_payment: downPaymentAmount,
          interest_rate: interestRate,
          tenure: tenureMonths,
          estimated_emi: monthlyEMI,
          employment_type: employmentType,
          monthly_income: monthlyIncome,
          message: formMsg || (paramVehicle ? `Finance application for ${paramVehicle}` : undefined),
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to submit");
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit finance application. Please contact our showroom directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0A0F1D] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-[#ED0000] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <BadgePercent className="w-4 h-4" />
            <span>Low Interest Used Car Loans in Barabanki</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Used Car Finance & EMI Calculator
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Calculate your monthly installment, compare loan tenures, and apply for immediate pre-approved funding with top Indian nationalized & private banks.
          </p>
        </div>

        {/* 2-Column Calculator + Result Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Sliders Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#121B2A] border border-[#273549] rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 pb-4 border-b border-[#1E293B]">
              <Calculator className="w-5 h-5 text-[#ED0000]" />
              <span>Customize Loan Parameters</span>
            </h2>

            {/* Slider 1: Vehicle Price */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-300">
                  Vehicle Price (₹)
                </label>
                <div className="text-base sm:text-lg font-black text-white bg-[#162032] border border-[#273549] px-3 py-1 rounded-md">
                  {formatPriceINR(vehiclePrice)}
                </div>
              </div>
              <input
                type="range"
                min="300000"
                max="8000000"
                step="50000"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full accent-[#ED0000] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>₹3 Lakh</span>
                <span>₹40 Lakh</span>
                <span>₹80 Lakh</span>
              </div>
            </div>

            {/* Slider 2: Down Payment */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-300">
                  Down Payment ({downPaymentPct}%)
                </label>
                <div className="text-base sm:text-lg font-black text-white bg-[#162032] border border-[#273549] px-3 py-1 rounded-md">
                  {formatPriceINR(downPaymentAmount)}
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                className="w-full accent-[#ED0000] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>10% (Min)</span>
                <span>30%</span>
                <span>60% (Max)</span>
              </div>
            </div>

            {/* Slider 3: Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-300">
                  Annual Interest Rate (% p.a.)
                </label>
                <div className="text-base sm:text-lg font-black text-white bg-[#162032] border border-[#273549] px-3 py-1 rounded-md">
                  {interestRate.toFixed(1)}%
                </div>
              </div>
              <input
                type="range"
                min="8.0"
                max="16.0"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#ED0000] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>8.0%</span>
                <span>11.5%</span>
                <span>16.0%</span>
              </div>
            </div>

            {/* Slider 4: Loan Tenure */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-300">
                  Loan Tenure ({tenureMonths} Months / {(tenureMonths / 12).toFixed(1)} Years)
                </label>
                <div className="text-base sm:text-lg font-black text-white bg-[#162032] border border-[#273549] px-3 py-1 rounded-md">
                  {tenureMonths} Mos
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {[12, 24, 36, 48, 60, 72].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setTenureMonths(months)}
                    className={`py-2 rounded-lg font-bold text-xs transition border ${
                      tenureMonths === months
                        ? "bg-[#ED0000] border-[#ED0000] text-white"
                        : "bg-[#162032] border-[#273549] text-slate-300 hover:text-white"
                    }`}
                  >
                    {months / 12} Yrs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EMI Calculation Summary Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#121B2A] border border-[#273549] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Estimated Monthly Installment
              </div>
              <div className="text-4xl sm:text-5xl font-black text-[#ED0000]">
                ₹{monthlyEMI.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-slate-400 ml-2">/ month</span>
              </div>

              {/* Breakdown Bars */}
              <div className="mt-8 space-y-4">
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${principalPct}%` }}
                    className="bg-emerald-500 h-full"
                    title={`Principal: ${principalPct}%`}
                  />
                  <div
                    style={{ width: `${interestPct}%` }}
                    className="bg-[#ED0000] h-full"
                    title={`Interest: ${interestPct}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span>Principal: {principalPct}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ED0000] inline-block" />
                    <span>Interest: {interestPct}%</span>
                  </div>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="mt-8 space-y-3 divide-y divide-[#1E293B] text-sm">
                <div className="flex justify-between pt-3">
                  <span className="text-slate-400">Net Loan Amount</span>
                  <span className="font-bold text-white">{formatPriceINR(loanPrincipal)}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-slate-400">Total Interest Payable</span>
                  <span className="font-bold text-white">{formatPriceINR(totalInterest)}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-slate-400">Total Amount Payable</span>
                  <span className="font-bold text-emerald-400">{formatPriceINR(totalPayable)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#162032] border border-[#273549] rounded-xl text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Hidden Fees Guarantee</span>
              </div>
              <p>Instant approval with minimal KYC documents at New Sai Car Bazar.</p>
            </div>
          </div>
        </div>

        {/* Loan Application Lead Form */}
        <div className="max-w-4xl mx-auto bg-[#121B2A] border border-[#273549] rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Apply for Pre-Approved Finance
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Submit your inquiry and our dedicated finance manager will connect with tailored interest quotes within 2 business hours.
            </p>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white">Finance Application Submitted!</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Thank you {name}. Our loan advisor will call you at <strong>{phone}</strong> to guide you through bank eligibility and fast approvals.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  >
                    <option value="Salaried">Salaried (Private / Govt)</option>
                    <option value="Self-Employed / Business">Self-Employed / Business</option>
                    <option value="Professional (Doctor, CA, Lawyer)">Professional</option>
                    <option value="Agriculture / Other">Agriculture / Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Additional Notes (Preferred Bank or Specific Car)
                </label>
                <textarea
                  rows={2}
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  placeholder="e.g. Prefer SBI / HDFC loan, looking for low down payment options..."
                  className="w-full bg-[#162032] border border-[#273549] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-3.5 rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting Application..." : "Submit Pre-Approval Application"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-white">Loading Finance Calculator...</div>}>
      <FinanceCalculatorContent />
    </Suspense>
  );
}
