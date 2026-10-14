"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText, ArrowLeft, Save, AlertCircle, Car, User, CreditCard,
  IndianRupee, Users
} from "lucide-react";

// ─── Helper: Convert number to Hindi words ────────────────────────────────────
const ONES = ["", "एक", "दो", "तीन", "चार", "पाँच", "छः", "सात", "आठ", "नौ",
  "दस", "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस"];
const TENS = ["", "", "बीस", "तीस", "चालीस", "पचास", "साठ", "सत्तर", "अस्सी", "नब्बे"];

function toHindiWords(n: number): string {
  if (n === 0) return "शून्य";
  if (n < 0) return "ऋण " + toHindiWords(-n);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  if (n < 1000) return ONES[Math.floor(n / 100)] + " सौ" + (n % 100 ? " " + toHindiWords(n % 100) : "");
  if (n < 100000) return toHindiWords(Math.floor(n / 1000)) + " हज़ार" + (n % 1000 ? " " + toHindiWords(n % 1000) : "");
  if (n < 10000000) return toHindiWords(Math.floor(n / 100000)) + " लाख" + (n % 100000 ? " " + toHindiWords(n % 100000) : "");
  return toHindiWords(Math.floor(n / 10000000)) + " करोड़" + (n % 10000000 ? " " + toHindiWords(n % 10000000) : "");
}

const FIELD_CLASS = "w-full bg-[#0E1828] border border-[#273549] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000] placeholder:text-slate-500 transition";
const LABEL_CLASS = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide";
const SECTION_CLASS = "bg-[#0F1828] border border-[#1E2D42] rounded-2xl p-5 sm:p-7 space-y-5";

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL_CLASS}>{label}{required && <span className="text-[#ED0000] ml-1">*</span>}</label>
      {children}
    </div>
  );
}

export default function NewDeedPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    deed_type: "SALE" as "SALE" | "PURCHASE",
    deed_date: new Date().toISOString().slice(0, 10),

    // Party
    party_name: "",
    party_relation_type: "पुत्र",
    party_relation_name: "",
    party_address: "",
    party_mobile: "",
    party_id_type: "Aadhaar",
    party_id_number: "",

    // Vehicle
    make_model: "",
    variant: "",
    color: "",
    mfg_year: "",
    reg_year: "",
    reg_number: "",
    fuel_type: "PETROL",
    chassis_number: "",
    engine_number: "",
    odometer_reading: "",
    reg_rto: "",
    insurance_policy_no: "",
    insurance_validity: "",
    puc_number: "",
    puc_validity: "",

    // Financial
    total_price: "",
    advance_amount: "",
    advance_receipt_no: "",
    payment_mode_1: "CASH",
    payment_ref_1: "",
    payment_date_1: new Date().toISOString().slice(0, 10),
    payment_place_1: "बाराबंकी",

    // Witnesses
    witness1_name: "", witness1_address: "", witness1_mobile: "",
    witness2_name: "", witness2_address: "", witness2_mobile: "",

    notes: "",
  });

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const totalPrice = parseInt(form.total_price) || 0;
  const advance = parseInt(form.advance_amount) || 0;
  const balance = Math.max(0, totalPrice - advance);
  const priceWords = totalPrice > 0 ? `रुपये ${toHindiWords(totalPrice)} मात्र` : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.party_name || !form.reg_number || !form.make_model || !form.total_price) {
      setError("Please fill all required fields (marked with *)");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        mfg_year: form.mfg_year ? parseInt(form.mfg_year) : null,
        reg_year: form.reg_year ? parseInt(form.reg_year) : null,
        odometer_reading: form.odometer_reading ? parseInt(form.odometer_reading) : null,
        total_price: totalPrice,
        total_price_words: priceWords,
        advance_amount: advance,
        balance_amount: balance,
      };
      const res = await fetch("/api/admin/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create deed");
      router.push(`/admin/deeds/${json.data.id}/print`);
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  const isSale = form.deed_type === "SALE";

  return (
    <div className="min-h-screen bg-[#070C1A] text-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/deeds" className="w-9 h-9 rounded-xl bg-[#1A2639] hover:bg-[#273549] flex items-center justify-center transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">नया विलेख / New Deed</h1>
          <p className="text-slate-400 text-xs mt-0.5">मोटर वाहन विक्रय / क्रय विलेख — New Sai Car Bazar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">

        {/* Deed Type Selector */}
        <div className={SECTION_CLASS}>
          <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-[#1E2D42] pb-4">
            <FileText className="w-4 h-4 text-[#ED0000]" />
            विलेख प्रकार / Deed Type
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {(["SALE", "PURCHASE"] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => set("deed_type", t)}
                className={`p-5 rounded-2xl border-2 text-left transition ${
                  form.deed_type === t
                    ? t === "SALE"
                      ? "border-rose-500 bg-rose-500/10"
                      : "border-purple-500 bg-purple-500/10"
                    : "border-[#273549] bg-[#0E1828] hover:border-slate-500"
                }`}
              >
                <div className={`font-black text-base ${form.deed_type === t ? (t === "SALE" ? "text-rose-400" : "text-purple-400") : "text-slate-300"}`}>
                  {t === "SALE" ? "विक्रय विलेख" : "क्रय विलेख"}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {t === "SALE" ? "Dealer → Customer (Car बेचना)" : "Individual → Dealer (Car खरीदना)"}
                </div>
              </button>
            ))}
          </div>
          <FormField label="विलेख दिनांक / Deed Date" required>
            <input type="date" value={form.deed_date} onChange={e => set("deed_date", e.target.value)} className={FIELD_CLASS} required />
          </FormField>
        </div>

        {/* Party Details */}
        <div className={SECTION_CLASS}>
          <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-[#1E2D42] pb-4">
            <User className="w-4 h-4 text-[#ED0000]" />
            {isSale ? "क्रेता विवरण (ग्राहक) / Buyer Details" : "विक्रेता विवरण / Seller Details"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="पूरा नाम / Full Name" required>
              <input type="text" value={form.party_name} onChange={e => set("party_name", e.target.value)} placeholder="e.g. रामकुमार शर्मा" className={FIELD_CLASS} required />
            </FormField>
            <div>
              <label className={LABEL_CLASS}>पुत्र / पुत्री / पत्नी</label>
              <div className="flex gap-2">
                <select value={form.party_relation_type} onChange={e => set("party_relation_type", e.target.value)} className={`${FIELD_CLASS} w-32 shrink-0`}>
                  <option>पुत्र</option>
                  <option>पुत्री</option>
                  <option>पत्नी</option>
                </select>
                <input type="text" value={form.party_relation_name} onChange={e => set("party_relation_name", e.target.value)} placeholder="Father/Husband name" className={FIELD_CLASS} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <FormField label="स्थायी पता / Address" required>
                <textarea rows={2} value={form.party_address} onChange={e => set("party_address", e.target.value)} placeholder="पूरा पता, जिला, राज्य, PIN" className={FIELD_CLASS} required />
              </FormField>
            </div>
            <FormField label="मोबाइल नं." required>
              <input type="tel" value={form.party_mobile} onChange={e => set("party_mobile", e.target.value)} placeholder="9876543210" className={FIELD_CLASS} required />
            </FormField>
            <div>
              <label className={LABEL_CLASS}>पहचान-पत्र</label>
              <div className="flex gap-2">
                <select value={form.party_id_type} onChange={e => set("party_id_type", e.target.value)} className={`${FIELD_CLASS} w-36 shrink-0`}>
                  <option>Aadhaar</option>
                  <option>DL</option>
                  <option>Passport</option>
                  <option>Voter ID</option>
                  <option>PAN</option>
                </select>
                <input type="text" value={form.party_id_number} onChange={e => set("party_id_number", e.target.value)} placeholder="ID Number" className={FIELD_CLASS} />
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className={SECTION_CLASS}>
          <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-[#1E2D42] pb-4">
            <Car className="w-4 h-4 text-[#ED0000]" />
            वाहन विवरण / Vehicle Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FormField label="Make & Model" required>
              <input type="text" value={form.make_model} onChange={e => set("make_model", e.target.value)} placeholder="e.g. Maruti Suzuki Swift" className={FIELD_CLASS} required />
            </FormField>
            <FormField label="वेरिएंट">
              <input type="text" value={form.variant} onChange={e => set("variant", e.target.value)} placeholder="e.g. VXI AMT" className={FIELD_CLASS} />
            </FormField>
            <FormField label="रंग / Color">
              <input type="text" value={form.color} onChange={e => set("color", e.target.value)} placeholder="e.g. Pearl White" className={FIELD_CLASS} />
            </FormField>
            <FormField label="निर्माण वर्ष">
              <input type="number" value={form.mfg_year} onChange={e => set("mfg_year", e.target.value)} placeholder="2022" min="1990" max="2026" className={FIELD_CLASS} />
            </FormField>
            <FormField label="पंजीकरण वर्ष">
              <input type="number" value={form.reg_year} onChange={e => set("reg_year", e.target.value)} placeholder="2022" min="1990" max="2026" className={FIELD_CLASS} />
            </FormField>
            <FormField label="पंजीकरण सं. (Reg. No.)" required>
              <input type="text" value={form.reg_number} onChange={e => set("reg_number", e.target.value.toUpperCase())} placeholder="UP 32 AB 1234" className={`${FIELD_CLASS} font-mono uppercase`} required />
            </FormField>
            <FormField label="ईंधन प्रकार">
              <select value={form.fuel_type} onChange={e => set("fuel_type", e.target.value)} className={FIELD_CLASS}>
                {["PETROL", "DIESEL", "CNG", "ELECTRIC", "HYBRID"].map(f => <option key={f}>{f}</option>)}
              </select>
            </FormField>
            <FormField label="चेसिस नं. (पूर्ण)">
              <input type="text" value={form.chassis_number} onChange={e => set("chassis_number", e.target.value.toUpperCase())} placeholder="Full Chassis Number" className={`${FIELD_CLASS} font-mono uppercase`} />
            </FormField>
            <FormField label="इंजन नं. (पूर्ण)">
              <input type="text" value={form.engine_number} onChange={e => set("engine_number", e.target.value.toUpperCase())} placeholder="Full Engine Number" className={`${FIELD_CLASS} font-mono uppercase`} />
            </FormField>
            <FormField label="ओडोमीटर (km)">
              <input type="number" value={form.odometer_reading} onChange={e => set("odometer_reading", e.target.value)} placeholder="45000" className={FIELD_CLASS} />
            </FormField>
            <FormField label="पंजीयन RTO">
              <input type="text" value={form.reg_rto} onChange={e => set("reg_rto", e.target.value)} placeholder="Barabanki RTO" className={FIELD_CLASS} />
            </FormField>
            <div />
            <FormField label="बीमा पॉलिसी नं.">
              <input type="text" value={form.insurance_policy_no} onChange={e => set("insurance_policy_no", e.target.value)} placeholder="Policy Number" className={FIELD_CLASS} />
            </FormField>
            <FormField label="बीमा वैधता">
              <input type="text" value={form.insurance_validity} onChange={e => set("insurance_validity", e.target.value)} placeholder="31/12/2025" className={FIELD_CLASS} />
            </FormField>
            <FormField label="PUC नं. एवं वैधता">
              <input type="text" value={form.puc_number} onChange={e => set("puc_number", e.target.value)} placeholder="PUC No. — Valid till MM/YYYY" className={FIELD_CLASS} />
            </FormField>
          </div>
        </div>

        {/* Financial Details */}
        <div className={SECTION_CLASS}>
          <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-[#1E2D42] pb-4">
            <IndianRupee className="w-4 h-4 text-[#ED0000]" />
            प्रतिफल / Financial Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label={`कुल ${isSale ? "विक्रय" : "क्रय"} मूल्य (₹)`} required>
              <input type="number" value={form.total_price} onChange={e => set("total_price", e.target.value)} placeholder="650000" className={FIELD_CLASS} required />
            </FormField>
            <div>
              <label className={LABEL_CLASS}>मूल्य शब्दों में</label>
              <div className="bg-[#0A1520] border border-[#1E2D42] rounded-xl px-4 py-2.5 text-sm text-amber-300 font-medium min-h-[42px]">
                {priceWords || <span className="text-slate-500 italic">कुल मूल्य दर्ज करने पर auto-fill</span>}
              </div>
            </div>
            <FormField label="अग्रिम राशि / Advance (₹)">
              <input type="number" value={form.advance_amount} onChange={e => set("advance_amount", e.target.value)} placeholder="50000" className={FIELD_CLASS} />
            </FormField>
            <div>
              <label className={LABEL_CLASS}>शेष राशि / Balance (₹)</label>
              <div className="bg-[#0A1520] border border-[#1E2D42] rounded-xl px-4 py-2.5 text-sm text-emerald-300 font-bold">
                {balance > 0 ? `₹ ${balance.toLocaleString("en-IN")}` : <span className="text-slate-500">Auto-calculated</span>}
              </div>
            </div>
            <FormField label="भुगतान माध्यम">
              <select value={form.payment_mode_1} onChange={e => set("payment_mode_1", e.target.value)} className={FIELD_CLASS}>
                {["CASH", "UPI", "CHEQUE", "NEFT", "BANK_TRANSFER", "CAR_LOAN"].map(m => <option key={m}>{m}</option>)}
              </select>
            </FormField>
            <FormField label="UPI Ref / Cheque No / UTR No.">
              <input type="text" value={form.payment_ref_1} onChange={e => set("payment_ref_1", e.target.value)} placeholder="Reference Number" className={FIELD_CLASS} />
            </FormField>
            <FormField label="भुगतान दिनांक">
              <input type="date" value={form.payment_date_1} onChange={e => set("payment_date_1", e.target.value)} className={FIELD_CLASS} />
            </FormField>
            <FormField label="भुगतान स्थान">
              <input type="text" value={form.payment_place_1} onChange={e => set("payment_place_1", e.target.value)} placeholder="बाराबंकी" className={FIELD_CLASS} />
            </FormField>
          </div>
        </div>

        {/* Witness Details */}
        <div className={SECTION_CLASS}>
          <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-[#1E2D42] pb-4">
            <Users className="w-4 h-4 text-[#ED0000]" />
            साक्षी विवरण / Witness Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map(w => (
              <div key={w} className="bg-[#0A1520] border border-[#1E2D42] rounded-xl p-4 space-y-3">
                <div className="text-xs font-black text-slate-300 uppercase tracking-wider">साक्षी {w} / Witness {w}</div>
                <FormField label="नाम">
                  <input type="text" value={(form as any)[`witness${w}_name`]} onChange={e => set(`witness${w}_name`, e.target.value)} placeholder="Witness Name" className={FIELD_CLASS} />
                </FormField>
                <FormField label="पता">
                  <input type="text" value={(form as any)[`witness${w}_address`]} onChange={e => set(`witness${w}_address`, e.target.value)} placeholder="Address" className={FIELD_CLASS} />
                </FormField>
                <FormField label="मोबाइल">
                  <input type="tel" value={(form as any)[`witness${w}_mobile`]} onChange={e => set(`witness${w}_mobile`, e.target.value)} placeholder="Mobile" className={FIELD_CLASS} />
                </FormField>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className={SECTION_CLASS}>
          <FormField label="विशेष टिप्पणी / Notes">
            <textarea rows={3} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Any special notes about this deed…" className={FIELD_CLASS} />
          </FormField>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4 pb-10">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#ED0000] hover:bg-[#D10000] disabled:opacity-60 text-white font-black px-8 py-3.5 rounded-xl text-sm transition shadow-xl shadow-red-950/30 cursor-pointer"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> Save & Print Deed</>
            )}
          </button>
          <Link href="/admin/deeds" className="text-slate-400 hover:text-white text-sm transition">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
