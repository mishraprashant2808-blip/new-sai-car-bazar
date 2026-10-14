"use client";

import React from "react";
import Image from "next/image";
import { Phone, MessageCircle, ShieldCheck, Award } from "lucide-react";
import { createPhoneCallUrl, createWhatsAppUrl } from "@/lib/utils";

interface Leader {
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  image: string;
  badge: string;
  bio: string;
  highlight: string;
}

const leaders: Leader[] = [
  {
    name: "Mr. Dinesh Mishra",
    role: "Founder & CEO",
    phone: "7007655230",
    whatsapp: "7007655230",
    image: "/team/dinesh-mishra.jpg",
    badge: "Visionary & Founder",
    bio: "With decades of deep-rooted automotive experience in Uttar Pradesh, Mr. Dinesh Mishra founded New Sai Car Bazar with a singular mission: to eliminate mistrust in the pre-owned car market. Under his stewardship, our dealership has grown into Barabanki's most reputable destination for certified cars.",
    highlight: "“Every car that leaves our showroom floor should be good enough for our own family. Trust is earned with honesty, not sales talk.”",
  },
  {
    name: "Mr. Shivam Mishra",
    role: "Managing Director",
    phone: "8528886630",
    whatsapp: "8528886630",
    image: "/team/shivam-mishra.jpg",
    badge: "Operations & Digital",
    bio: "Spearheading modern operations, technical inspections, and seamless customer service, Mr. Shivam Mishra brings dynamic leadership to New Sai Car Bazar. He oversees our 150-point quality verification, swift RC documentation, and instant car financing facilitation.",
    highlight: "“We are redefining used car buying with complete transparency, verified service histories, and end-to-end customer care.”",
  },
];

export default function LeadershipSection({ className = "" }: { className?: string }) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-[#ED0000] uppercase bg-red-600/10 border border-red-600/20 px-3.5 py-1.5 rounded-full mb-3 shadow-sm">
            <Award className="w-3.5 h-3.5 text-[#ED0000]" />
            <span>Leadership & Visionaries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Meet the Pillars of New Sai Car Bazar
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            The driving minds who ensure every customer drives away with total peace of mind, verified vehicle quality, and unmatched after-sales respect.
          </p>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {leaders.map((leader, idx) => (
            <div
              key={idx}
              className="group relative bg-[#121B2A] border border-[#273549] hover:border-red-600/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-950/20 flex flex-col"
            >
              {/* Image & Overlay Container */}
              <div className="relative aspect-[4/5] sm:aspect-[1/1] md:aspect-[4/5] w-full overflow-hidden bg-slate-900">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  priority
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121B2A] via-[#121B2A]/40 to-transparent" />

                {/* Floating Role Pill */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-[#ED0000] text-white text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                    {leader.role}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-slate-200 text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
                    {leader.badge}
                  </span>
                </div>

                {/* Leader Name Over Image (Mobile / Bottom overlay) */}
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                    {leader.name}
                  </h3>
                  <p className="text-red-400 font-bold text-sm tracking-wide">
                    {leader.role} — New Sai Car Bazar
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Quote / Highlight */}
                  <div className="relative pl-4 border-l-2 border-[#ED0000] italic text-slate-300 text-sm leading-relaxed">
                    {leader.highlight}
                  </div>

                  {/* Bio */}
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                {/* Direct Connect Buttons */}
                <div className="pt-4 border-t border-[#1E293B] space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Direct Contact & Consultation
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={createPhoneCallUrl(leader.phone)}
                      className="flex items-center justify-center gap-2 bg-[#1A2639] hover:bg-[#22324B] border border-[#2B3B52] text-white text-xs sm:text-sm font-bold py-2.5 px-3 rounded-xl transition duration-200 shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#ED0000]" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={createWhatsAppUrl(
                        leader.whatsapp,
                        `Hello ${leader.name}, I would like to inquire about purchasing a car from New Sai Car Bazar.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold py-2.5 px-3 rounded-xl transition duration-200 shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assurance Banner */}
        <div className="mt-12 bg-gradient-to-r from-red-950/30 via-[#121B2A] to-red-950/30 border border-red-600/20 rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-300 text-sm">
            <div className="w-10 h-10 rounded-full bg-red-600/20 text-[#ED0000] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-base">Direct Leadership Accountability</div>
              <div className="text-slate-400 text-xs sm:text-sm">
                Have a special vehicle request, bulk corporate deal, or want a personalized valuation? Feel free to contact our leadership team directly.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
