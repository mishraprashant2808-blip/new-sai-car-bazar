import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data/store";
import { leadSchema } from "@/lib/validation/lead";

function withTimeout<T>(promise: PromiseLike<T>, ms = 1500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Supabase timeout")), ms)),
  ]);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = leadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, phone, email, message, vehicle_id, source } = validation.data;

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
          return NextResponse.json({ success: true, data });
        }
      } catch {
        // Supabase unreachable/paused - fallback to DataStore
      }
    }

    DataStore.createLead({ name, phone, email, message, vehicle_id, source });
    return NextResponse.json({ success: true, message: "Enquiry recorded successfully" });
  } catch (err: any) {
    console.error("Enquiry API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process enquiry" },
      { status: 500 }
    );
  }
}
