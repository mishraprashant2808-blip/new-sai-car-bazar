import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken, SESSION_COOKIE_NAME } from "@/lib/adminAuth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Only handle admin routes
  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // Whitelisted admin routes that do not require authentication
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/auth") ||
    pathname === "/api/admin/logout"
  ) {
    // If user is already authenticated and visits /admin/login, redirect to /admin
    if (pathname === "/admin/login") {
      const fallbackToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      const validFallback = await verifyAdminToken(fallbackToken);
      if (validFallback) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // 1. Check resilient admin session cookie (zero-latency, 100% cloud-outage proof)
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (sessionToken) {
    const adminSession = await verifyAdminToken(sessionToken);
    if (adminSession) {
      return NextResponse.next();
    }
  }

  // 2. Check Supabase session with network safety (try-catch + timeout)
  let isSupabaseAuthenticated = false;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    let response = NextResponse.next({ request });
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      });

      const userPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
        setTimeout(() => resolve({ data: { user: null } }), 1200)
      );

      const { data } = await Promise.race([userPromise, timeoutPromise]);
      if (data?.user) {
        isSupabaseAuthenticated = true;
        return response;
      }
    } catch {
      // Supabase is unreachable/paused — fail safely without crashing
      isSupabaseAuthenticated = false;
    }
  }

  // 3. If authenticated via Supabase, continue
  if (isSupabaseAuthenticated) {
    return NextResponse.next();
  }

  // 4. Deny access if unauthenticated
  if (isAdminApi) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  // For admin web pages, redirect to login
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
