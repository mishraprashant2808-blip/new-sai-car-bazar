"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, ArrowRight, MessageCircle } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { DataStore } from "@/lib/data/store";
import { formatPriceINR, formatKM, createWhatsAppUrl } from "@/lib/utils";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const allVehicles = DataStore.getAllVehiclesAdmin();
  const wishlistVehicles = allVehicles.filter((v) => wishlistIds.includes(v.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F1827] text-white border-l border-[#273549] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#273549] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Saved Wishlist</h2>
              <span className="bg-[#ED0000] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {wishlistVehicles.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vehicle List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistVehicles.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#1C293A] text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="font-semibold text-slate-200 text-base">Your Wishlist is Empty</h3>
                <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
                  Click the heart icon on any vehicle card in the inventory to save cars for later comparison.
                </p>
                <Link
                  href="/inventory"
                  onClick={onClose}
                  className="mt-6 inline-block bg-[#ED0000] hover:bg-[#D10000] text-white text-xs font-bold px-5 py-2.5 rounded transition"
                >
                  Explore Inventory
                </Link>
              </div>
            ) : (
              wishlistVehicles.map((vehicle) => {
                const primaryImg = vehicle.images.find(img => img.is_primary)?.image_url || vehicle.images[0]?.image_url || "/placeholder-car.jpg";
                return (
                  <div
                    key={vehicle.id}
                    className="flex gap-4 p-3 bg-[#162032] border border-[#273549] rounded-lg hover:border-slate-500 transition group relative"
                  >
                    <div className="relative w-24 h-20 rounded overflow-hidden shrink-0 bg-slate-800">
                      <Image
                        src={primaryImg}
                        alt={vehicle.variant || "Car"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/inventory/${vehicle.slug}`}
                        onClick={onClose}
                        className="font-bold text-sm text-white hover:text-[#ED0000] transition block truncate"
                      >
                        {vehicle.year} {vehicle.make?.name} {vehicle.model?.name}
                      </Link>
                      <p className="text-xs text-slate-400 truncate">{vehicle.variant}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatKM(vehicle.mileage)} • {vehicle.fuel_type}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-black text-[#ED0000]">
                          {formatPriceINR(vehicle.price)}
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={createWhatsAppUrl(
                              "+918172946630",
                              `Hello, I am interested in ${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name} listed on New Sai Car Bazar.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                            title="WhatsApp Dealer"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => toggleWishlist(vehicle.id)}
                            className="p-1 text-slate-400 hover:text-rose-400"
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer CTA */}
          {wishlistVehicles.length > 0 && (
            <div className="p-5 border-t border-[#273549] bg-[#0A0F1D]">
              <Link
                href="/inventory"
                onClick={onClose}
                className="w-full bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-3 rounded text-center block text-sm transition"
              >
                Compare & View All
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
