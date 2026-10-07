import { NextRequest, NextResponse } from "next/server";

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
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return action + ":" + (userId || "anon:" + ip);
}