import { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory token bucket cache per IP and action prefix
const rateLimitCache = new Map<string, RateLimitRecord>();

// Clean up expired tokens periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitCache.entries()) {
      if (record.resetAt <= now) {
        rateLimitCache.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(req: Request | NextRequest): string {
  const headers = req.headers;
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  return (
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("true-client-ip") ||
    "127.0.0.1"
  );
}

export interface RateLimitOptions {
  maxRequests: number;     // e.g. 5 requests
  windowSeconds: number;   // e.g. 60 seconds (1 minute)
  keyPrefix?: string;      // e.g. "login", "enquiry"
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

export function checkRateLimit(
  req: Request | NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const ip = getClientIp(req);
  const prefix = options.keyPrefix || "default";
  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;

  let record = rateLimitCache.get(key);

  if (!record || record.resetAt <= now) {
    // New window
    record = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitCache.set(key, record);
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
    };
  }

  // Existing window
  record.count += 1;
  const remaining = Math.max(0, options.maxRequests - record.count);

  if (record.count > options.maxRequests) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remaining,
  };
}

