"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

interface MainHeaderProps {
  onOpenWishlist?: () => void;
}

export default function MainHeader({ onOpenWishlist }: MainHeaderProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { wishlistCount } = useWishlist();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/inventory?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/inventory");
    }
  };

  return (
    <header className="bg-[#0F1827] text-white border-b border-[#1E293B] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group">
          <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-[#ED0000] uppercase font-sans drop-shadow-sm group-hover:opacity-90 transition-opacity">
            NEW SAI CAR BAZAR
          </span>
          <span className="block text-[10px] text-slate-400 tracking-widest uppercase font-medium">
            Barabanki • Quality Pre-Owned
          </span>
        </Link>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6 hidden md:block">
          <form onSubmit={handleSearch} className="flex items-center w-full">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by make, model, year..."
                className="w-full bg-[#162032] text-sm text-white placeholder-slate-400 border border-[#273549] rounded-l-md px-4 py-2.5 focus:outline-none focus:border-[#ED0000] focus:ring-1 focus:ring-[#ED0000] transition"
              />
            </div>
            <button
              type="submit"
              className="bg-[#ED0000] hover:bg-[#D10000] text-white text-sm font-semibold px-6 py-2.5 rounded-r-md transition flex items-center justify-center shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right: Account & Wishlist */}
        <div className="flex items-center space-x-5 sm:space-x-7 shrink-0">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm text-slate-200 hover:text-white transition group"
            title="Admin Portal / Account"
          >
            <User className="w-5 h-5 text-slate-300 group-hover:text-[#ED0000] transition" />
            <span className="hidden sm:inline font-medium">Account</span>
          </Link>

          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative flex items-center text-slate-200 hover:text-white transition group p-1"
            title="Saved Wishlist Vehicles"
          >
            <Heart className="w-6 h-6 text-slate-300 group-hover:text-[#ED0000] transition" />
            <span className="absolute -top-1.5 -right-2 bg-[#ED0000] text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#0F1827]">
              {wishlistCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar below header */}
      <div className="p-3 md:hidden border-t border-[#1E293B] bg-[#121B2A]">
        <form onSubmit={handleSearch} className="flex items-center w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by make, model, year..."
            className="w-full bg-[#162032] text-xs text-white placeholder-slate-400 border border-[#273549] rounded-l-md px-3 py-2 focus:outline-none focus:border-[#ED0000]"
          />
          <button
            type="submit"
            className="bg-[#ED0000] text-white text-xs font-semibold px-4 py-2 rounded-r-md shrink-0"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
