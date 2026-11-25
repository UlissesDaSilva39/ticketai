/**
 * Single source of truth for runtime configuration.
 * NO component should read process.env directly — import from here.
 */

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`[config] Missing required env var: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function parseList(csv: string): string[] {
  return csv.split(",").map((s) => s.trim()).filter(Boolean);
}

export const config = {
  env: optional("NEXT_PUBLIC_ENV", "development"),
  isProd: optional("NEXT_PUBLIC_ENV", "development") === "production",

  api: {
    baseUrl: required("NEXT_PUBLIC_API_BASE_URL", "http://localhost:3001/api"),
    timeoutMs: 15_000,
    retryCount: 1,
  },

  app: {
    url: optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  },

  auth: {
    loginPath: optional("NEXT_PUBLIC_AUTH_LOGIN_PATH", "/auth/login"),
    logoutPath: optional("NEXT_PUBLIC_AUTH_LOGOUT_PATH", "/auth/logout"),
    refreshPath: optional("NEXT_PUBLIC_AUTH_REFRESH_PATH", "/auth/refresh"),
  },

  security: {
    allowedOrigins: parseList(
      optional("NEXT_PUBLIC_ALLOWED_ORIGINS", "http://localhost:3000")
    ),
    rateLimitEnabled:
      optional("NEXT_PUBLIC_RATE_LIMIT_ENABLED", "true") === "true",
  },
} as const;