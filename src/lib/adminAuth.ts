const SESSION_COOKIE_NAME = "nscb_admin_session";
const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || "nscb-resilient-admin-secret-2025";
const DEFAULT_ADMIN_EMAIL = process.env.NEXT_PUBLIC_DEALER_EMAIL || "mishraprashant2808@gmail.com";

export interface AdminSession {
  email: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

function base64UrlEncode(str: string): string {
  if (typeof btoa === "function") {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(str).toString("base64url");
}

function base64UrlDecode(str: string): string {
  if (typeof atob === "function") {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return atob(base64);
  }
  return Buffer.from(str, "base64url").toString("utf-8");
}

async function signData(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64UrlEncode(binary);
}

export async function createAdminToken(email: string): Promise<string> {
  const payload: AdminSession = {
    email: email.trim().toLowerCase(),
    role: "admin",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await signData(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminToken(token?: string | null): Promise<AdminSession | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const expectedSig = await signData(encodedPayload);

  if (signature !== expectedSig) return null;

  try {
    const jsonStr = base64UrlDecode(encodedPayload);
    const json = JSON.parse(jsonStr);
    if (json.role !== "admin" || !json.expiresAt || json.expiresAt < Date.now()) {
      return null;
    }
    return json as AdminSession;
  } catch {
    return null;
  }
}

export async function requireAdminAuth(req: Request): Promise<boolean> {
  // 1. Check resilient cookie
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
  const token = match ? decodeURIComponent(match[1]) : null;
  if (token) {
    const session = await verifyAdminToken(token);
    if (session) return true;
  }

  // 2. Check Authorization header (Bearer)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    const session = await verifyAdminToken(bearerToken);
    if (session) return true;

    // Check if Bearer token is a valid Supabase JWT
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey && bearerToken.length > 20) {
      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${bearerToken}`,
          },
        });
        if (res.ok) {
          const user = await res.json();
          if (user?.id) return true;
        }
      } catch {
        // Fallback
      }
    }
  }

  // 3. Check Supabase cookies in request
  const hasSupabaseCookie = cookieHeader.includes("sb-") && cookieHeader.includes("-auth-token");
  if (hasSupabaseCookie) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const sbMatch = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/);
        if (sbMatch) {
          let rawVal = decodeURIComponent(sbMatch[1]);
          if (rawVal.startsWith("base64-")) {
            rawVal = Buffer.from(rawVal.slice(7), "base64").toString("utf-8");
          }
          let accessToken = "";
          try {
            const parsed = JSON.parse(rawVal);
            accessToken = Array.isArray(parsed) ? parsed[0] : (parsed?.access_token || parsed?.[0]?.access_token);
          } catch {
            accessToken = rawVal;
          }
          if (accessToken) {
            const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
              headers: {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${accessToken}`,
              },
            });
            if (res.ok) {
              const user = await res.json();
              if (user?.id) return true;
            }
          }
        }
      } catch {
        // Supabase network unreachable
      }
    }
  }

  return false;
}

export { SESSION_COOKIE_NAME, DEFAULT_ADMIN_EMAIL };
