import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabase } from "@/lib/supabase/client";

function getClient() {
  const client = supabaseAdmin || supabase;
  if (!client) {
    throw new Error("Supabase is not configured");
  }
  return client;
}

// GET /api/admin/agreements - list all agreements
export async function GET(req: NextRequest) {
  try {
    const client = getClient();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const rc_status = searchParams.get("rc_status");

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

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, data: [] }, { status: 200 });
  }
}

// POST /api/admin/agreements - create new agreement
export async function POST(req: NextRequest) {
  try {
    const client = getClient();
    const body = await req.json();

    // Generate deed number
    const prefix = body.deed_type === "PURCHASE" ? "NSCB-KRAY" : "NSCB-VIKRAY";
    const year = new Date().getFullYear();
    const { count } = await client
      .from("agreements")
      .select("*", { count: "exact", head: true })
      .eq("deed_type", body.deed_type);
    const num = String((count ?? 0) + 1).padStart(3, "0");
    const deed_number = `${prefix}-${year}-${num}`;

    const { data, error } = await client
      .from("agreements")
      .insert({ ...body, deed_number })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
