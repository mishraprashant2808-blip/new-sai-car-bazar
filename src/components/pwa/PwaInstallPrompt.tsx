"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Download, X, Share, PlusSquare, Sparkles, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

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

    // 2. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Check snooze state
    const dismissedUntil = localStorage.getItem("nscb_pwa_dismissed_until");
    const isDismissed = dismissedUntil && Number(dismissedUntil) > Date.now();

    // 4. Android / Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. If iOS and not dismissed, show after gentle delay (4s)
    if (isIosDevice && !isDismissed) {
      const timer = setTimeout(() => {
        if (!checkStandalone()) {
          setShowBanner(true);
        }
      }, 4000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }

    // 6. Listen for manual trigger from header/drawer
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
      // Browser fallback instructions
      alert("To install, tap your browser's menu (⋮) and select 'Install app' or 'Add to Home screen'.");
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Snooze prompt for 5 days
    localStorage.setItem("nscb_pwa_dismissed_until", String(Date.now() + 5 * 24 * 60 * 60 * 1000));
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
                  <Sparkles className="w-2.5 h-2.5" /> Fast
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-tight">
                Install for instant vehicle alerts, offline car catalog & low-rate EMI calculator.
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="bg-[#ED0000] hover:bg-[#D10000] active:scale-[0.98] text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-md shadow-red-900/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isIos ? "Add to Home Screen" : "Install App"}</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-2 font-medium transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#162032] border border-[#273549] text-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-[#0F172A]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#0F172A] border border-[#273549] p-1 shrink-0">
                <Image
                  src="/icons/apple-touch-icon.png"
                  alt="Sai Car Bazar"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Install on iPhone / iPad</h3>
                <p className="text-xs text-slate-400">3 simple steps to add to your Home Screen</p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3.5 text-xs text-slate-300 mb-6 bg-[#0F1827] p-4 rounded-2xl border border-[#273549]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>Tap the</span>
                  <span className="inline-flex items-center gap-1 bg-[#1E293B] px-2 py-0.5 rounded font-semibold text-white">
                    <Share className="w-3.5 h-3.5 text-blue-400" /> Share button
                  </span>
                  <span>in Safari toolbar.</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>Scroll down & tap</span>
                  <span className="inline-flex items-center gap-1 bg-[#1E293B] px-2 py-0.5 rounded font-semibold text-white">
                    <PlusSquare className="w-3.5 h-3.5 text-emerald-400" /> Add to Home Screen
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-red-500/20 text-[#ED0000] font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Tap</span>
                  <span className="font-bold text-white bg-[#1E293B] px-2 py-0.5 rounded">Add</span>
                  <span>in top right corner to finish.</span>
                </div>
              </div>
            </div>

            {/* Got It Button */}
            <button
              onClick={() => {
                setShowIosModal(false);
                setShowBanner(false);
              }}
              className="w-full bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Got It</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

