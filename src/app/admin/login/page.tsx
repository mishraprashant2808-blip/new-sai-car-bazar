"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("mishraprashant2808@gmail.com");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // Simple demo authentication check (accepts admin password or any non-empty password for initial setup)
    setTimeout(() => {
      if (email.trim() && password.trim()) {
        localStorage.setItem("nscb_admin_auth", "true");
        localStorage.setItem("nscb_admin_email", email.trim());
        router.push("/admin");
      } else {
        setErrorMsg("Please enter both email and password.");
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#ED0000] uppercase block">
          NEW SAI CAR BAZAR
        </span>
        <h2 className="mt-2 text-xl font-bold text-white tracking-tight">
          Admin Portal Authentication
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Authorized Dealership Management Portal • Barabanki
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0F1827] py-8 px-6 shadow-2xl rounded-2xl border border-[#273549] sm:px-10">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#162032] border border-[#273549] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#162032] border border-[#273549] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#162032] rounded-lg border border-[#273549] text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Development Access</span>
              </div>
              <span>Enter any password (e.g. <strong>admin123</strong>) to access the management portal.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-3 rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
            >
              <span>{isLoading ? "Signing In..." : "Sign In to Admin Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#1E293B] text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
              ← Return to Public Dealership Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
