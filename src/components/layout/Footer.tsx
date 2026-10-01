"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, FileText, BadgePercent, Headphones, ArrowRight, CheckCircle2, Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const [emailSub, setEmailSub] = useState("");
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSubSuccess(true);
      setEmailSub("");
      setTimeout(() => setSubSuccess(false), 4000);
    }
  };

  return (
    <footer className="bg-[#0A0F1D] text-white border-t border-[#1C293A]">
      {/* 4 Feature Columns Bar (Screenshot 4) */}
      <div className="border-b border-[#1C293A] bg-[#0E1526]/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Search className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Certified Inspection</h4>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">150-Point Pre-Sale Check</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Vehicle History</h4>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">Full Report with Every Car</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <BadgePercent className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Flexible Finance</h4>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">Low-Rate Loans Available</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">24/7 Support</h4>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">Dedicated Customer Care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4 Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: ABOUT US */}
          <div>
            <h3 className="text-base font-extrabold tracking-wider uppercase text-white mb-4">
              ABOUT US
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              New Sai Car Bazar is your trusted destination for quality pre-owned vehicles. We offer transparent pricing, certified multi-point inspection, and a stress-free buying experience.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <a href="#" className="w-9 h-9 rounded-full bg-[#162032] flex items-center justify-center hover:bg-[#ED0000] hover:text-white transition" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#162032] flex items-center justify-center hover:bg-[#ED0000] hover:text-white transition" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#162032] flex items-center justify-center hover:bg-[#ED0000] hover:text-white transition" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: QUICK LINKS */}
          <div>
            <h3 className="text-base font-extrabold tracking-wider uppercase text-white mb-4">
              QUICK LINKS
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/about" className="hover:text-[#ED0000] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#ED0000] transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/sell-my-car" className="hover:text-[#ED0000] transition">
                  Sell My Car
                </Link>
              </li>
              <li>
                <Link href="/finance" className="hover:text-[#ED0000] transition">
                  Finance Options
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="hover:text-[#ED0000] transition">
                  Browse Inventory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: MORE INFO */}
          <div>
            <h3 className="text-base font-extrabold tracking-wider uppercase text-white mb-4">
              MORE INFO
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/about" className="hover:text-[#ED0000] transition">
                  Buying Guide
                </Link>
              </li>
              <li>
                <Link href="/finance" className="hover:text-[#ED0000] transition">
                  Car Value Estimator
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" className="hover:text-[#ED0000] transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#ED0000] transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-slate-400 text-xs text-slate-500 transition">
                  Dealership Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: NEW ARRIVALS */}
          <div>
            <h3 className="text-base font-extrabold tracking-wider uppercase text-white mb-4">
              NEW ARRIVALS
            </h3>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              Get notified when new vehicles match your wishlist.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center">
                <input
                  type="email"
                  required
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder="Your email"
                  className="w-full bg-[#162032] text-sm text-white placeholder-slate-400 border border-[#273549] rounded-l-md px-3.5 py-2.5 focus:outline-none focus:border-[#ED0000]"
                />
                <button
                  type="submit"
                  className="bg-[#ED0000] hover:bg-[#D10000] text-white px-4 py-2.5 rounded-r-md transition flex items-center justify-center shrink-0 cursor-pointer"
                  title="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Thank you! We will notify you of fresh arrivals.</span>
                </div>
              )}
            </form>

            <div className="mt-6 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ED0000] shrink-0" />
                <span>Barabanki, Uttar Pradesh, India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#ED0000] shrink-0" />
                <span>+91 8858982362</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payment Badges */}
      <div className="border-t border-[#162032] py-6 bg-[#070B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 New Sai Car Bazar. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4 text-slate-300 font-semibold tracking-wide">
            <span className="flex items-center gap-1">💳 Visa</span>
            <span className="text-slate-600">•</span>
            <span>Mastercard</span>
            <span className="text-slate-600">•</span>
            <span>UPI / NetBanking</span>
            <span className="text-slate-600">•</span>
            <span>Bank Draft</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
