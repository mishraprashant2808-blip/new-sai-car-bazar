"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  FileSpreadsheet,
  Users,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  User,
  FileText,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Check Supabase session on mount and route changes
  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    if (!supabase) {
      router.push("/admin/login");
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(true);
        setAdminEmail(session.user.email || "");
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(true);
        setAdminEmail(session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      // Call server-side logout to clear cookies
      await fetch("/api/admin/logout", { method: "POST" });
      // Also sign out client-side
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // Continue logout even on error
    }
    router.push("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A0F1D] flex items-center justify-center text-white">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-[#ED0000] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Inventory", href: "/admin/inventory", icon: Car },
    { name: "Add Vehicle", href: "/admin/inventory/new", icon: PlusCircle },
    { name: "CSV Bulk Import", href: "/admin/inventory/import", icon: FileSpreadsheet },
    { name: "Customer Leads", href: "/admin/leads", icon: Users },
    { name: "Deeds & Register", href: "/admin/deeds", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0F1827] border-b border-[#273549] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#ED0000] font-black text-lg">NEW SAI CAR BAZAR</span>
          <span className="text-[10px] bg-red-600/20 text-[#ED0000] font-bold px-1.5 py-0.5 rounded">ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#0F1827] border-r border-[#273549] flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Dealership Badge */}
          <div className="p-6 border-b border-[#1E293B]">
            <Link href="/admin" className="block">
              <span className="text-xl font-black tracking-wider text-[#ED0000] uppercase block">
                NEW SAI CAR BAZAR
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Admin Management
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#ED0000] text-white shadow-lg shadow-red-950/40"
                      : "text-slate-300 hover:text-white hover:bg-[#162032]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1E293B] space-y-2">
          {/* Logged in user */}
          {adminEmail && (
            <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-400 truncate">
              <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{adminEmail}</span>
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#162032] transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] text-slate-500">Public</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-[#070B14] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
