import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data/store";
import { leadSchema } from "@/lib/validation/lead";
import { checkRateLimit } from "@/lib/rateLimit";

function withTimeout<T>(promise: PromiseLike<T>, ms = 1500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Supabase timeout")), ms)),
  ]);
}

export async function POST(req: Request) {
  try {
    // Rate limit: 10 enquiries per 10 minutes per IP
    const rateLimit = checkRateLimit(req, {
      maxRequests: 10,
      windowSeconds: 600,
      keyPrefix: "enquiry",
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions. Please wait ${Math.ceil(
            (rateLimit.retryAfterSeconds || 60) / 60
          )} minutes before submitting another enquiry.`,
        },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds || 600) } }
      );
    }

    const body = await req.json();
    const validation = leadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, phone, email, message, vehicle_id, source } = validation.data;

    // Build Instant Lead WhatsApp Notification link
    const dealerWhatsApp = "918172946630";
    const waText = [
      `🚗 *New Enquiry — New Sai Car Bazar*`,
      `👤 *Customer:* ${name}`,
      `📞 *Phone:* ${phone}`,
      email ? `✉️ *Email:* ${email}` : null,
      vehicle_id ? `🚘 *Vehicle ID / Reference:* ${vehicle_id}` : null,
      message ? `💬 *Requirement:* ${message}` : null,
      `📍 *Source:* ${source || "Website Enquiry"}`,
    ].filter(Boolean).join("\n");
    const whatsappUrl = `https://wa.me/${dealerWhatsApp}?text=${encodeURIComponent(waText)}`;

    // Use admin client if available, else standard client
    const client = supabaseAdmin || supabase;

    if (client) {
      try {
        const insertPromise = client
          .from("leads")
          .insert([
            {
              name,
              phone,
              email: email || null,
              message: message || null,
              vehicle_id: vehicle_id || null,
              source: source || "website_modal",
              status: "NEW",
            },
          ])
          .select()
          .single();

        const { data, error } = await withTimeout(insertPromise, 1500);

        if (!error && data) {
          DataStore.createLead({ name, phone, email, message, vehicle_id, source });
          return NextResponse.json({
            success: true,
            data,
            whatsappUrl,
            message: "Enquiry recorded successfully. Instant dealer WhatsApp notification ready.",
          });
        }
      } catch {
        // Supabase unreachable/paused - fallback to DataStore
      }
    }

    DataStore.createLead({ name, phone, email, message, vehicle_id, source });
    return NextResponse.json({
      success: true,
      whatsappUrl,
      message: "Enquiry recorded successfully. Instant dealer WhatsApp notification ready.",
    });
  } catch (err: any) {
    console.error("Enquiry API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process enquiry" },
      { status: 500 }
    );
  }
}
