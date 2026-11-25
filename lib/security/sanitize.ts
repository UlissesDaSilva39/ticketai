/**
 * Frontend-side input sanitization.
 * Defense-in-depth only — the middle layer MUST re-validate.
 */

export function sanitizeString(input: string, maxLen = 2000): string {
  return input.trim().slice(0, maxLen);
}

export function isSafeRedirect(url: string): boolean {
  try {
    const allowed = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
    const parsed = new URL(url, allowed);
    return parsed.origin === new URL(allowed).origin;
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}