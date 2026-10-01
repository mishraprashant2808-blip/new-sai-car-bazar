import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data/store";
import { leadSchema } from "@/lib/validation/lead";

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
      const { data, error } = await client
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

      if (error) {
        console.error("Supabase insert lead error:", error);
        // Fallback to local store
        DataStore.createLead({ name, phone, email, message, vehicle_id, source });
      } else {
        DataStore.createLead({
          name,
          phone,
          email,
          message,
          vehicle_id,
          source,
        });
        return NextResponse.json({ success: true, data });
      }
    } else {
      DataStore.createLead({ name, phone, email, message, vehicle_id, source });
    }

    return NextResponse.json({ success: true, message: "Enquiry recorded successfully" });
  } catch (err: any) {
    console.error("Enquiry API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process enquiry" },
      { status: 500 }
    );
  }
}
