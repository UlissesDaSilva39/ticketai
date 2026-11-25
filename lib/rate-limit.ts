import { NextRequest, NextResponse } from "next/server";

// In-memory fixed-window rate limiting. Good for a single server / local dev.
// On serverless hosting (several instances) swap the Map for a shared store
// such as Upstash Redis (@upstash/ratelimit).

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type RateLimitConfig = {
  key: string;
  limit: number;
  windowMs: number;
};

export function checkRateLimit(cfg: RateLimitConfig): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(cfg.key);

  if (!existing || existing.resetAt < now) {
    const fresh = { count: 1, resetAt: now + cfg.windowMs };
    buckets.set(cfg.key, fresh);
    return { ok: true, remaining: cfg.limit - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= cfg.limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { ok: true, remaining: cfg.limit - existing.count, resetAt: existing.resetAt };
}

export function rateLimitResponse(resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Please slow down." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export function getClientKey(req: NextRequest, userId: string | null, action: string) {
  return action + ":" + (userId || "anon:" + clientIp(req.headers));
}

// ---- Helpers used by auth routes (login / sign-up) ----

export type RateLimitResult = { ok: boolean; remaining: number; retryAfterSec: number };

/** Counts one hit for `key`; allows `limit` hits per `windowMs`. */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const r = checkRateLimit({ key, limit, windowMs });
  if (buckets.size > 10_000) {
    const now = Date.now();
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
  }
  return { ok: r.ok, remaining: r.remaining, retryAfterSec: Math.max(1, Math.ceil((r.resetAt - Date.now()) / 1000)) };
}

/** Clears a key, e.g. after a successful login. */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}

/** Best-effort client IP from proxy headers. */
export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
