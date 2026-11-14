import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SESSION_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear resilient session cookie
  response.cookies.delete(SESSION_COOKIE_NAME);

  // Clear Supabase session if configured
  try {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000)),
      ]);
    }
  } catch {
    // Supabase unreachable, cookie already cleared
  }

  return response;
}
