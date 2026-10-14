import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";
import { DataStore } from "@/lib/data/store";

function getClient() {
  return supabaseAdmin || supabase;
}

function withTimeout<T>(promise: PromiseLike<T>, ms = 1200): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Supabase timeout")), ms)),
  ]);
}

// GET /api/admin/agreements - list all agreements
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || undefined;
  const search = searchParams.get("search") || undefined;
  const rc_status = searchParams.get("rc_status") || undefined;

  const client = getClient();
  if (client) {
    try {
      let query = client
        .from("agreements")
        .select("*")
        .order("created_at", { ascending: false });

      if (type) query = query.eq("deed_type", type);
      if (rc_status) query = query.eq("rc_transfer_status", rc_status);
      if (search) {
        query = query.or(
          `party_name.ilike.%${search}%,party_mobile.ilike.%${search}%,reg_number.ilike.%${search}%,make_model.ilike.%${search}%`
        );
      }

      const res = await withTimeout(query);
      if (!res.error && res.data && res.data.length > 0) {
        return NextResponse.json({ data: res.data });
      }
    } catch {
      // Supabase timeout or missing table: fallback to DataStore
    }
  }

  // Graceful fallback to DataStore
  const data = DataStore.getAgreements({ type, search, rc_status });
  return NextResponse.json({ data });
}

// POST /api/admin/agreements - create new agreement
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const client = getClient();
    if (client) {
      try {
        const prefix = body.deed_type === "PURCHASE" ? "NSCB-KRAY" : "NSCB-VIKRAY";
        const year = new Date().getFullYear();
        const countRes = await withTimeout(
          client
            .from("agreements")
            .select("*", { count: "exact", head: true })
            .eq("deed_type", body.deed_type)
        );
        const count = countRes?.count ?? 0;
        const num = String(count + 1).padStart(3, "0");
        const deed_number = `${prefix}-${year}-${num}`;

        const insertRes = await withTimeout(
          client
            .from("agreements")
            .insert({ ...body, deed_number })
            .select()
            .single()
        );

        if (!insertRes.error && insertRes.data) {
          DataStore.createAgreement({ ...insertRes.data });
          return NextResponse.json({ data: insertRes.data }, { status: 201 });
        }
      } catch {
        // Supabase error or table missing: fallback to DataStore below
      }
    }

    // Graceful fallback to DataStore
    const newAgreement = DataStore.createAgreement(body);
    return NextResponse.json({ data: newAgreement }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
