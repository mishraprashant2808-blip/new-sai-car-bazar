import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, SESSION_COOKIE_NAME } from "@/lib/adminAuth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  // 1. Check resilient admin cookie first (local / zero-latency)
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const adminSession = await verifyAdminToken(token);

  if (adminSession) {
    return NextResponse.json({
      authenticated: true,
      email: adminSession.email,
      source: "resilient-session",
    });
  }

  // 2. Check Supabase server session
  try {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data: { user } } = await Promise.race([
        supabase.auth.getUser(),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Supabase timeout")), 1500)),
      ]);

      if (user) {
        return NextResponse.json({
          authenticated: true,
          email: user.email,
          source: "supabase",
        });
      }
    }
  } catch {
    // Supabase unreachable or timed out
  }

  return NextResponse.json({
    authenticated: false,
    email: null,
  });
}
