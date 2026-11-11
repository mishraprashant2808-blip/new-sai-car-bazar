"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, X, Share, PlusSquare, Sparkles, CheckCircle2, AlertTriangle, Copy, Check, ArrowDown } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [inAppName, setInAppName] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");
      setIsStandalone(Boolean(isStandaloneMode));
      return Boolean(isStandaloneMode);
    };

    if (checkStandalone()) return;

    // 2. Detect iOS (iPhone / iPad / iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIos(isIosDevice);

    // 3. Detect In-App Browsers
    if (userAgent.includes("instagram")) {
      setIsInAppBrowser(true);
      setInAppName("Instagram");
    } else if (userAgent.includes("whatsapp")) {
      setIsInAppBrowser(true);
      setInAppName("WhatsApp");
    } else if (userAgent.includes("fban") || userAgent.includes("fbav")) {
      setIsInAppBrowser(true);
      setInAppName("Facebook");
    } else if (userAgent.includes("crios")) {
      setIsInAppBrowser(true);
      setInAppName("Chrome on iOS");
    } else if (userAgent.includes("twitter") || userAgent.includes("x/")) {
      setIsInAppBrowser(true);
      setInAppName("X / Twitter");
    }

    // 4. Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. If iOS, show banner after 1.5s
    if (isIosDevice) {
      const timer = setTimeout(() => {
        if (!checkStandalone()) {
          setShowBanner(true);
        }
      }, 1500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }

    // 6. Listen for manual trigger from header/drawer/footer
    const handleManualTrigger = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
      } else if (isIosDevice) {
        setShowIosModal(true);
      } else {
        setShowBanner(true);
      }
    };

    window.addEventListener("nscb-trigger-pwa-install", handleManualTrigger);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("nscb-trigger-pwa-install", handleManualTrigger);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android / Chromium native install prompt
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      // Show iOS step-by-step instructions
      setShowIosModal(true);
    } else {
      window.location.href = "/install";
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://new-sai-car-bazar.vercel.app");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Install Banner */}
      {showBanner && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-[#162032]/95 backdrop-blur-md border border-[#273549] text-white p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3.5">
            {/* App Icon */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#0F172A] border border-[#273549] shrink-0 p-1">
              <Image
                src="/icons/icon-192x192.png"
                alt="New Sai Car Bazar App"
                width={48}
                height={48}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* App Info */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-bold text-sm text-white">Sai Car Bazar App</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-[#ED0000] border border-red-500/30 px-1.5 py-0.2 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> PWA
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-tight">
                {isIos
                  ? "Add to your iPhone Home Screen for instant offline car browsing & EMI tools."
                  : "Install on your phone for instant inventory search, low-rate loans & offline catalog."}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="bg-[#ED0000] hover:bg-[#D10000] active:scale-[0.98] text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-md shadow-red-900/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isIos ? "Add to iPhone" : "Install App"}</span>
                </button>

                <Link
                  href="/install"
                  onClick={() => setShowBanner(false)}
                  className="text-xs text-slate-300 hover:text-white px-2.5 py-2 font-medium transition"
                >
                  Guide
                </Link>

                <button
                  onClick={handleDismiss}
                  className="text-xs text-slate-400 hover:text-white px-2 py-2 font-medium transition cursor-pointer"
                >
                  Not now
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg transition"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS "Add to Home Screen" Step-by-Step Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#162032] border border-[#273549] text-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-[#0F172A]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#0F172A] border border-[#273549] p-1 shrink-0">
                <Image
                  src="/apple-touch-icon.png"
                  alt="Sai Car Bazar"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Add to iPhone Home Screen</h3>
                <p className="text-xs text-slate-400">Install as a full screen app in Safari</p>
              </div>
            </div>

            {/* In-App Browser Warning Alert */}
            {isInAppBrowser && (
              <div className="mb-4 bg-amber-500/15 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>You are inside {inAppName}</span>
                </div>
                <p className="leading-tight">
                  Apple only allows adding to Home Screen inside <strong>Safari</strong>. Tap <strong>(⋯)</strong> &rarr; <strong>Open in Safari</strong>, or copy the link below.
                </p>
                <button
                  onClick={handleCopyLink}
                  className="bg-[#0F1827] text-white border border-[#273549] px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied! Paste in Safari" : "Copy Link"}</span>
                </button>
              </div>
            )}

            {/* Steps */}
            <div className="space-y-3.5 text-xs text-slate-300 mb-5 bg-[#0F1827] p-4 rounded-2xl border border-[#273549]">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Tap Safari&apos;s</span>
                    <span className="inline-flex items-center gap-1 bg-[#1E293B] border border-blue-500/40 text-blue-400 px-2 py-0.5 rounded font-bold">
                      <Share className="w-3.5 h-3.5" /> Share Button
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Located in the toolbar at the bottom center of your screen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Scroll down and tap</span>
                    <span className="inline-flex items-center gap-1 bg-[#1E293B] border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded font-bold">
                      <PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Scroll past your contacts in the share menu to find this option.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/20 text-[#ED0000] font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span>Tap</span>
                    <span className="font-bold text-white bg-[#1E293B] border border-red-500/40 px-2 py-0.5 rounded">
                      Add
                    </span>
                    <span>in top right corner</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    The app icon will immediately appear on your iPhone!
                  </p>
                </div>
              </div>
            </div>

            {/* Animated Pointer down to bottom toolbar */}
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center mb-4 text-xs text-blue-300 flex items-center justify-center gap-2">
              <ArrowDown className="w-4 h-4 text-blue-400 animate-bounce" />
              <span>Look at the bottom of Safari for the <strong>Share [↑]</strong> button</span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowIosModal(false);
                  setShowBanner(false);
                }}
                className="w-full bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-900/40"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Understand, Show Me Safari</span>
              </button>

              <Link
                href="/install"
                onClick={() => setShowIosModal(false)}
                className="w-full bg-[#0F1827] hover:bg-[#1A263A] text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center border border-[#273549]"
              >
                <span>View Full Photo Guide</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
