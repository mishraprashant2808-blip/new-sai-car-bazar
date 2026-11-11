"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff, Phone, MessageCircle, MapPin, RefreshCw, Car, ArrowLeft } from "lucide-react";

export default function OfflinePage() {
  const [isChecking, setIsChecking] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      window.location.reload();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsChecking(true);
    if (navigator.onLine) {
      window.location.href = "/";
    } else {
      setTimeout(() => {
        setIsChecking(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#162032] border border-[#273549] rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Top red glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-[#ED0000] to-rose-600" />

        {/* Offline Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#ED0000] flex items-center justify-center mx-auto mb-5 shadow-inner">
          <WifiOff className="w-8 h-8 animate-pulse" />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          You Are Currently Offline
        </h1>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          It looks like your internet connection is down. Don&apos;t worry, you can still call or WhatsApp us directly, or reload when you&apos;re back online.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full bg-[#ED0000] hover:bg-[#D10000] active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
            <span>{isChecking ? "Checking Connection..." : "Check Connection & Reload"}</span>
          </button>

          <Link
            href="/"
            className="w-full bg-[#0F1827] hover:bg-[#1A263A] text-slate-200 border border-[#273549] font-semibold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Try Returning to Home</span>
          </Link>
        </div>

        {/* Quick Offline Contact Card */}
        <div className="bg-[#0F1827] border border-[#273549] rounded-xl p-4 text-left space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Direct Showroom Assistance
          </div>

          <a
            href="tel:+918858982362"
            className="flex items-center gap-3 text-sm text-slate-200 hover:text-white transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Direct Call</div>
              <div className="font-bold text-white group-hover:text-emerald-400 transition">+91 8858982362</div>
            </div>
          </a>

          <a
            href="https://wa.me/918172946630?text=Hello%20New%20Sai%20Car%20Bazar%2C%20I%20am%20calling%20regarding%20used%20car%20inventory."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-slate-200 hover:text-white transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">WhatsApp</div>
              <div className="font-bold text-white group-hover:text-green-400 transition">+91 8172946630</div>
            </div>
          </a>

          <div className="flex items-start gap-3 text-xs text-slate-300 pt-1 border-t border-[#1E293B]">
            <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>Near Railway Crossing, Lucknow-Ayodhya Road, Barabanki, UP 225001</span>
          </div>
        </div>
      </div>
    </div>
  );
}

