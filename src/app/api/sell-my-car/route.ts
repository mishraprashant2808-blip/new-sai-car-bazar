import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data/store";
import { sellCarSchema } from "@/lib/validation/sell-car";

function withTimeout<T>(promise: PromiseLike<T>, ms = 1500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Supabase timeout")), ms)),
  ]);
}

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
      try {
        const descriptionParts = [
          data.variant ? `Variant: ${data.variant}` : null,
          data.condition ? `Condition: ${data.condition}` : null,
        ].filter(Boolean).join(" | ");

        const insertPromise = client
          .from("sell_car_requests")
          .insert([
            {
              make: data.make,
              model: data.model,
              year: data.year,
              mileage: data.mileage,
              fuel_type: data.fuel_type || null,
              transmission: data.transmission || null,
              registration: null,
              expected_price: data.expected_price || null,
              name: data.name,
              phone: data.phone,
              email: data.email || null,
              city: data.city || "Barabanki",
              description: descriptionParts || null,
              photo_urls: data.images || [],
              status: "NEW",
            },
          ])
          .select()
          .single();

        const { data: inserted, error } = await withTimeout(insertPromise, 1500);

        if (!error && inserted) {
          DataStore.createSellCarRequest(data as any);
          return NextResponse.json({ success: true, data: inserted });
        }
      } catch {
        // Fallback to DataStore when Supabase cloud is unreachable
      }
    }

    DataStore.createSellCarRequest(data as any);
    return NextResponse.json({ success: true, message: "Sell car request submitted successfully" });
  } catch (err: any) {
    console.error("Sell car API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit request" },
      { status: 500 }
    );
  }
}
