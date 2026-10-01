import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data/store";
import { sellCarSchema } from "@/lib/validation/sell-car";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = sellCarSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const data = validation.data;
    const client = supabaseAdmin || supabase;

    if (client) {
      const { data: inserted, error } = await client
        .from("sell_car_requests")
        .insert([
          {
            make_name: data.make,
            model_name: data.model,
            year: data.year,
            variant: data.variant || null,
            mileage: data.mileage,
            fuel_type: data.fuel_type,
            transmission: data.transmission,
            expected_price: data.expected_price || null,
            condition: data.condition || null,
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            city: data.city || "Barabanki",
            images: data.images || [],
            status: "NEW",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase sell car error:", error);
        DataStore.createSellCarRequest(data as any);
      } else {
        DataStore.createSellCarRequest(data as any);
        return NextResponse.json({ success: true, data: inserted });
      }
    } else {
      DataStore.createSellCarRequest(data as any);
    }

    return NextResponse.json({ success: true, message: "Valuation request received" });
  } catch (err: any) {
    console.error("Sell car API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit request" },
      { status: 500 }
    );
  }
}
