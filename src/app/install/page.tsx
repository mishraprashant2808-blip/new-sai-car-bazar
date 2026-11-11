"use client";

import React, { useState, useEffect } from "react";
import Link from "next/image";
import Image from "next/image";
import { 
  Download, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink,
  AlertTriangle,
  Info
} from "lucide-react";

export default function InstallAppPage() {
  const [device, setDevice] = useState<"ios" | "android" | "desktop">("desktop");
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [inAppName, setInAppName] = useState("");
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(Boolean(standalone));

    // Detect User Agent
    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /android/.test(ua);

    if (isIos) {
      setDevice("ios");
    } else if (isAndroid) {
      setDevice("android");
    } else {
      setDevice("desktop");
    }

    // Detect In-App Browsers
    if (ua.includes("instagram")) {
      setIsInAppBrowser(true);
      setInAppName("Instagram");
    } else if (ua.includes("whatsapp")) {
      setIsInAppBrowser(true);
      setInAppName("WhatsApp");
    } else if (ua.includes("fban") || ua.includes("fbav")) {
      setIsInAppBrowser(true);
      setInAppName("Facebook");
    } else if (ua.includes("crios")) {
      setIsInAppBrowser(true);
      setInAppName("Chrome on iOS");
    } else if (ua.includes("twitter") || ua.includes("x/")) {
      setIsInAppBrowser(true);
      setInAppName("X / Twitter");
    }

    // Android install prompt event
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://new-sai-car-bazar.vercel.app");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      alert("Tap your browser menu (three dots ⋮ in top-right) and select 'Install app' or 'Add to Home screen'.");
    }
  };

  return (
    <div className="bg-[#0F172A] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Back Link */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </a>

        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-[#162032] border border-[#273549] p-2 mx-auto shadow-2xl relative">
            <Image
              src="/icons/icon-192x192.png"
              alt="Sai Car Bazar App Icon"
              width={80}
              height={80}
              className="w-full h-full object-contain rounded-xl"
            />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0F172A]"></span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Install Sai Car Bazar App
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
              Get the native app experience on your phone with zero app store downloads. Works 100% free with offline support.
            </p>
          </div>

          {/* Already Installed Alert */}
          {isStandalone && (
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Great news! You are already running the app in Standalone Mode.</span>
            </div>
          )}

          {/* Device Selector Tabs */}
          <div className="inline-flex p-1 bg-[#162032] border border-[#273549] rounded-xl text-xs font-bold">
            <button
              onClick={() => setDevice("ios")}
              className={`px-4 py-2 rounded-lg transition ${
                device === "ios" ? "bg-[#ED0000] text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              iPhone / iPad
            </button>
            <button
              onClick={() => setDevice("android")}
              className={`px-4 py-2 rounded-lg transition ${
                device === "android" ? "bg-[#ED0000] text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Android
            </button>
            <button
              onClick={() => setDevice("desktop")}
              className={`px-4 py-2 rounded-lg transition ${
                device === "desktop" ? "bg-[#ED0000] text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              PC / Mac
            </button>
          </div>
        </div>

        {/* ===================== iOS (iPhone) Section ===================== */}
        {device === "ios" && (
          <div className="bg-[#162032] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* In-App Browser Warning */}
            {isInAppBrowser && (
              <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Notice: You are inside {inAppName}</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  Apple only allows adding apps to your Home Screen from the <strong>Safari</strong> browser. 
                  Tap the three dots <strong>(⋯)</strong> or Share button on your screen and select <strong>&quot;Open in Safari&quot;</strong>.
                </p>
                <button
                  onClick={handleCopyLink}
                  className="mt-2 bg-[#0F1827] hover:bg-[#1E293B] text-white border border-[#273549] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Link Copied! Open Safari & Paste" : "Copy Website Link"}</span>
                </button>
              </div>
            )}

            <div className="border-b border-[#273549] pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#ED0000]" />
                <span>How to Add to iPhone Home Screen</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Follow these 3 quick steps in Apple Safari:
              </p>
            </div>

            {/* 3 Steps */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0F1827] border border-[#273549]">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-black flex items-center justify-center shrink-0 text-sm">
                  1
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                    <span>Tap the Safari</span>
                    <span className="inline-flex items-center gap-1 bg-[#1E293B] border border-blue-500/40 text-blue-400 px-2 py-0.5 rounded font-bold text-xs">
                      <Share className="w-3.5 h-3.5" /> Share Button
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Look at the bottom toolbar of your iPhone screen in Safari. It looks like a square box with an arrow pointing straight up.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0F1827] border border-[#273549]">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 text-sm">
                  2
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                    <span>Scroll down and tap</span>
                    <span className="inline-flex items-center gap-1 bg-[#1E293B] border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded font-bold text-xs">
                      <PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    In the options list, scroll down past your contacts and tap &quot;Add to Home Screen&quot;.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0F1827] border border-[#273549]">
                <div className="w-8 h-8 rounded-full bg-red-500/20 text-[#ED0000] font-black flex items-center justify-center shrink-0 text-sm">
                  3
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Tap</span>
                    <span className="bg-[#1E293B] border border-red-500/40 text-white px-2 py-0.5 rounded font-bold text-xs">
                      Add
                    </span>
                    <span>in the top-right corner</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Confirm by tapping &quot;Add&quot;. The Sai Car Bazar red car icon will immediately appear on your iPhone screen!
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Pointer Graphic */}
            <div className="p-4 bg-gradient-to-b from-[#10192A] to-[#0A101D] border border-[#273549] rounded-xl text-center space-y-2">
              <div className="text-xs text-slate-300 font-semibold">
                Tip: On iPhone, the Share icon is at the very bottom center of Safari:
              </div>
              <div className="inline-flex items-center gap-3 bg-[#162032] px-6 py-2.5 rounded-full border border-blue-500/30 text-blue-400 text-sm font-bold shadow-lg">
                <Share className="w-4 h-4 animate-bounce" />
                <span>Tap this icon at the bottom of Safari</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== Android Section ===================== */}
        {device === "android" && (
          <div className="bg-[#162032] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-[#273549] pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-[#ED0000]" />
                <span>Install on Android Phone</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Install directly in Google Chrome, Samsung Internet, or Brave.
              </p>
            </div>

            <div className="text-center py-4 space-y-4">
              <button
                onClick={handleInstallAndroid}
                className="w-full bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-4 px-6 rounded-xl text-base transition shadow-xl shadow-red-950/50 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Tap to Install Sai Car Bazar App</span>
              </button>
              <p className="text-xs text-slate-400">
                Or tap the Chrome menu <strong>(three dots ⋮)</strong> in the top-right corner and choose <strong>&quot;Install app&quot;</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ===================== Desktop Section ===================== */}
        {device === "desktop" && (
          <div className="bg-[#162032] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-[#273549] pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ED0000]" />
                <span>Install on PC / Mac</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Run New Sai Car Bazar as a native desktop application in Chrome or Edge.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 bg-[#0F1827] rounded-xl border border-[#273549] space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Look at your browser&apos;s address bar:</span>
                </div>
                <p className="text-slate-400 pl-8">
                  Click the <strong>Install</strong> icon (computer with downward arrow) located on the right side of the address bar.
                </p>
              </div>

              <div className="p-4 bg-[#0F1827] rounded-xl border border-[#273549] space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Click &quot;Install&quot;:</span>
                </div>
                <p className="text-slate-400 pl-8">
                  The app will open in its own clean window and add a shortcut to your desktop & taskbar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* App Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-[#162032] border border-[#273549] rounded-xl">
            <div className="text-[#ED0000] font-black text-lg mb-1">0 MB</div>
            <div className="text-xs text-slate-400">Zero storage waste compared to heavy native store apps</div>
          </div>
          <div className="p-4 bg-[#162032] border border-[#273549] rounded-xl">
            <div className="text-emerald-400 font-black text-lg mb-1">Offline</div>
            <div className="text-xs text-slate-400">Browse saved cars and contact showroom without internet</div>
          </div>
          <div className="p-4 bg-[#162032] border border-[#273549] rounded-xl">
            <div className="text-blue-400 font-black text-lg mb-1">Instant</div>
            <div className="text-xs text-slate-400">Always runs the latest live showroom inventory automatically</div>
          </div>
        </div>

        {/* Return Button */}
        <div className="text-center pt-2">
          <a
            href="/inventory"
            className="inline-flex items-center gap-2 bg-[#ED0000] hover:bg-[#D10000] text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-red-950/40"
          >
            <span>Browse Available Inventory</span>
          </a>
        </div>
      </div>
    </div>
  );
}

