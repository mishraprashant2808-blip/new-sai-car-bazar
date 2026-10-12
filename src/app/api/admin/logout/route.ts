import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true }); // Always succeed logout
  }
}
