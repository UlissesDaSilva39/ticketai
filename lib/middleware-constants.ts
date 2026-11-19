/**
 * FLAT primitives only — safe for the Edge middleware bundle.
 * NO functions, NO nested objects, NO throws.
 * If you add to this file, import the constant into middleware.ts
 * instead of duplicating strings.
 */
export const AUTH_COOKIE_NAME =
  process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "ticketai_session";

export const IS_PROD = process.env.NEXT_PUBLIC_ENV === "production";

export const PROTECTED_PATHS = [
  "/dashboard",
  "/home",
  "/analytics",
  "/social",
  "/premium",
  "/verify",
] as const;