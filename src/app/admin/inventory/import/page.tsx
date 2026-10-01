"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, ArrowLeft, Upload, CheckCircle2, AlertTriangle, Copy, Check } from "lucide-react";
import { DataStore } from "@/lib/data/store";

export default function AdminCSVImportPage() {
  const router = useRouter();

  const SAMPLE_CSV = `make,model,variant,year,price,mileage,fuel_type,transmission,body_type,color
Toyota,Innova Crysta,2.4 GX 7 STR,2022,1980000,32000,DIESEL,MANUAL,MUV,Silver
Maruti Suzuki,Swift,ZXI Plus,2023,780000,16500,PETROL,MANUAL,HATCHBACK,Red
Hyundai,Verna,SX Turbo DCT,2023,1590000,14000,PETROL,AUTOMATIC,SEDAN,Black
Mahindra,Thar,LX 4-Str Hard Top Diesel AT,2022,1650000,28000,DIESEL,AUTOMATIC,SUV,Aqua Marine`;

  const [csvContent, setCsvContent] = useState(SAMPLE_CSV);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    valid: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleCopySample = () => {
    navigator.clipboard.writeText(SAMPLE_CSV);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCsvContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    if (!csvContent.trim()) return;
    const res = DataStore.importVehiclesCSV(csvContent);
    setResult(res);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="p-2 bg-[#162032] border border-[#273549] rounded-lg text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">CSV Bulk Vehicle Import</h1>
            <p className="text-xs text-slate-400">Import multiple cars into inventory simultaneously</p>
          </div>
        </div>

        <button
          onClick={handleCopySample}
          className="bg-[#162032] hover:bg-[#1E293B] text-slate-200 border border-[#273549] text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied Sample CSV" : "Copy Sample CSV"}</span>
        </button>
      </div>

      {/* Import Form Card */}
      <div className="bg-[#0F1827] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Upload CSV File
          </label>
          <div className="border-2 border-dashed border-[#273549] hover:border-slate-500 rounded-xl p-6 text-center cursor-pointer transition bg-[#121B2A]">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-file-input"
            />
            <label htmlFor="csv-file-input" className="cursor-pointer block space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-200">
                Click to browse or drop your .csv file here
              </div>
              <div className="text-xs text-slate-500">
                Supports standard comma-separated format
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Or Edit / Paste CSV Text
          </label>
          <textarea
            rows={8}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            className="w-full bg-[#162032] border border-[#273549] rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-[#ED0000]"
          />
        </div>

        {/* Required Headers Notice */}
        <div className="p-4 bg-[#121B2A] border border-[#273549] rounded-xl text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300">Required Column Headers:</div>
          <p className="font-mono text-[11px] text-slate-400">
            make, model, year, price, mileage, fuel_type, transmission, body_type
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
          <button
            onClick={() => setCsvContent(SAMPLE_CSV)}
            className="px-5 py-2.5 bg-[#162032] text-slate-300 font-semibold rounded-lg text-xs hover:bg-[#1E293B]"
          >
            Reset to Sample
          </button>
          <button
            onClick={handleImport}
            className="px-6 py-2.5 bg-[#ED0000] hover:bg-[#D10000] text-white font-bold rounded-lg text-sm transition shadow-lg shadow-red-950/40 cursor-pointer"
          >
            Validate & Import Records
          </button>
        </div>

        {/* Results Modal / Panel */}
        {result && (
          <div className="mt-6 p-6 bg-[#162032] border border-[#273549] rounded-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Import Summary</span>
            </h3>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-[#0F1827] rounded-lg">
                <div className="text-xs text-slate-400">Total Rows</div>
                <div className="text-xl font-black text-white">{result.total}</div>
              </div>
              <div className="p-3 bg-[#0F1827] rounded-lg">
                <div className="text-xs text-emerald-400 font-semibold">Valid & Imported</div>
                <div className="text-xl font-black text-emerald-400">{result.valid}</div>
              </div>
              <div className="p-3 bg-[#0F1827] rounded-lg">
                <div className="text-xs text-rose-400 font-semibold">Failed Rows</div>
                <div className="text-xl font-black text-rose-400">{result.failed}</div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg space-y-1">
                <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Validation Warnings:</span>
                </div>
                {result.errors.map((err, idx) => (
                  <div key={idx} className="text-[11px] text-red-300">
                    {err}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Link
                href="/admin/inventory"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition"
              >
                Go to Inventory List →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
