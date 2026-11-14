"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Car, Shield, Calculator, Tag, Info, PhoneCall } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Inventory", href: "/inventory" },
    { name: "Browse by Make", href: "/inventory#makes" },
    { name: "Finance", href: "/finance" },
    { name: "Sell My Car", href: "/sell-my-car" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const quickVehicleLinks = [
    { name: "All Available Cars", href: "/inventory" },
    { name: "Certified SUVs", href: "/inventory?bodyType=suv" },
    { name: "Executive Sedans", href: "/inventory?bodyType=sedan" },
    { name: "City Hatchbacks", href: "/inventory?bodyType=hatchback" },
    { name: "Automatic Transmission", href: "/inventory?transmission=automatic" },
    { name: "Budget Friendly (Under ₹15 Lakh)", href: "/inventory?maxPrice=1500000" },
  ];

  return (
    <nav className="bg-[#162032] border-b border-[#233147] text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        {/* Left: "All Vehicles" Red Button */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#ED0000] hover:bg-[#D10000] text-white font-bold text-sm tracking-wide px-5 py-2.5 rounded-sm flex items-center gap-2.5 transition shadow-sm cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>All Vehicles</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* "All Vehicles" Dropdown Menu */}
          {dropdownOpen && (
            <div 
              className="absolute left-0 top-full mt-2 w-72 bg-[#0F172A] border border-[#273549] rounded-md shadow-2xl z-50 py-2 divide-y divide-[#1E293B]"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="py-1">
                {quickVehicleLinks.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-[#ED0000] transition"
                  >
                    <Car className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center/Right: Primary Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center space-x-1 sm:space-x-2 font-medium text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md transition duration-150 ${
                  isActive
                    ? "text-[#ED0000] font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:text-white p-2 rounded focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101827] border-b border-[#273549] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-base font-medium text-slate-200 hover:text-white hover:bg-[#1E293B]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#1E293B]">
            <Link
              href="/inventory"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-[#ED0000] text-white font-semibold py-2.5 rounded text-sm mt-2"
            >
              Browse Complete Inventory
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
