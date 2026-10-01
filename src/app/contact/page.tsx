"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { createPhoneCallUrl, createWhatsAppUrl } from "@/lib/utils";
import { DataStore } from "@/lib/data/store";
import { leadSchema } from "@/lib/validation/lead";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const validation = leadSchema.safeParse({
      name,
      phone,
      email: email || undefined,
      message,
      source: "contact_page",
    });

    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message || "Please check your contact details.");
      return;
    }

    setIsSubmitting(true);
    try {
      DataStore.createLead({
        name,
        phone,
        email,
        message,
        source: "contact_page",
      });
      setIsSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      setErrorMsg("Failed to send message. Please contact us via phone or WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0A0F1D] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block text-xs font-black tracking-widest text-[#ED0000] uppercase bg-red-600/10 border border-red-600/20 px-3 py-1 rounded-full mb-3">
            GET IN TOUCH
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Contact New Sai Car Bazar
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Have questions about a car, loan eligibility, or want to schedule a test drive? Reach out to our Barabanki team today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121B2A] border border-[#273549] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-white pb-4 border-b border-[#1E293B]">
                Showroom Details
              </h3>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 text-[#ED0000] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Call Us</div>
                  <a
                    href={createPhoneCallUrl("8858982362")}
                    className="text-lg font-bold text-white hover:text-[#ED0000] transition block mt-0.5"
                  >
                    +91 8858982362
                  </a>
                  <div className="text-xs text-slate-400 mt-0.5">Direct phone assistance</div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">WhatsApp Chat</div>
                  <a
                    href={createWhatsAppUrl("+918172946630", "Hello New Sai Car Bazar, I have an enquiry regarding used cars in Barabanki.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-emerald-400 hover:text-emerald-300 transition block mt-0.5"
                  >
                    +91 8172946630
                  </a>
                  <div className="text-xs text-slate-400 mt-0.5">Quick replies & car photos</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Email</div>
                  <a
                    href="mailto:mishraprashant2808@gmail.com"
                    className="text-sm font-bold text-white hover:text-[#ED0000] transition block mt-0.5"
                  >
                    mishraprashant2808@gmail.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Showroom Address</div>
                  <div className="text-sm font-medium text-slate-200 mt-0.5 leading-relaxed">
                    Near Railway Crossing, Lucknow-Ayodhya Road, Barabanki, Uttar Pradesh 225001
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Working Hours</div>
                  <div className="text-sm font-medium text-slate-200 mt-0.5">
                    Monday - Sunday: 9:30 AM - 8:30 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#121B2A] border border-[#273549] rounded-2xl p-6 sm:p-10 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-2">Send Us a Direct Message</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Fill in your details below and our team will get back to you promptly.
            </p>

            {isSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Thank you for reaching out. We will connect with you via phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Prashant Mishra"
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full bg-[#162032] border border-[#273549] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what vehicle you are looking for, or any question you have..."
                    className="w-full bg-[#162032] border border-[#273549] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ED0000]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#ED0000] hover:bg-[#D10000] text-white font-bold py-3.5 rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
