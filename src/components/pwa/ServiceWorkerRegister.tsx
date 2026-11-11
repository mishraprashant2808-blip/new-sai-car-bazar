"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function ServiceWorkerRegister() {
  const [offlineToast, setOfflineToast] = useState(false);
  const [onlineToast, setOnlineToast] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          const reg = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });

          // Check for service worker updates
          reg.addEventListener("updatefound", () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.addEventListener("statechange", () => {
                if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New update available, activate it
                  installingWorker.postMessage({ type: "SKIP_WAITING" });
                }
              });
            }
          });
        } catch (err) {
          console.warn("[PWA] ServiceWorker registration notice:", err);
        }
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
      }
    }

    // 2. Online / Offline Listener
    const handleOnline = () => {
      setOfflineToast(false);
      setOnlineToast(true);
      const timer = setTimeout(() => setOnlineToast(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setOnlineToast(false);
      setOfflineToast(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Toast Banner */}
      {offlineToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-amber-300 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
          <span>Offline Mode — Showing Cached Vehicles & Contact</span>
        </div>
      )}

      {/* Reconnected Toast Banner */}
      {onlineToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <Wifi className="w-4 h-4 text-white shrink-0" />
          <span>Connected — You are back online!</span>
        </div>
      )}
    </>
  );
}

