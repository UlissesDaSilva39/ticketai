"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// Only allow same-site redirects like /home (blocks //evil.com and full URLs)
function safeRedirect(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/home";
  return value;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = safeRedirect(params.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? "Login failed. Check your details and try again.");
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left: brand + benefits */}
      <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white p-12">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          GRID
        </Link>

        <div>
          <h2 className="text-4xl font-bold leading-tight">Welcome back to the industry&apos;s #1 music network.</h2>
          <p className="mt-4 text-lg text-emerald-50">Pick up where you left off. Get booked. Get paid.</p>
          <ul className="mt-8 space-y-3 text-emerald-50">
            <li><span aria-hidden="true" className="text-emerald-200">&#10003;</span> Access to 10,000+ artists and venues</li>
            <li><span aria-hidden="true" className="text-emerald-200">&#10003;</span> Secure Escrow payments on every deal</li>
            <li><span aria-hidden="true" className="text-emerald-200">&#10003;</span> Verified badges to build trust</li>
            <li><span aria-hidden="true" className="text-emerald-200">&#10003;</span> Licensing, Billboard and royalty splits</li>
          </ul>
        </div>

        <p className="text-sm text-emerald-100">&copy; 2026 GRID Music Ltd. All rights reserved.</p>
      </aside>

      {/* Right: form */}
      <section className="flex items-center justify-center p-8 bg-white text-neutral-900">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden text-2xl font-extrabold tracking-tight text-emerald-700">
            GRID
          </Link>

          <h1 className="mt-6 lg:mt-0 text-3xl font-bold">Log in</h1>
          <p className="mt-2 text-sm text-neutral-600">
            New to GRID?{" "}
            <Link href="/signup" className="font-semibold text-emerald-700 underline hover:text-emerald-800">
              Create your account
            </Link>
          </p>

          <button
            type="button"
            onClick={async () => {
              setError(null);
              const params = new URLSearchParams({ next: redirectTo });
              const { error } = await createClient().auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}/auth/callback?${params}` },
              });
              if (error) setError("Google sign-in isn't available right now. Please use your email.");
            }}
            className="mt-6 w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm font-medium hover:border-emerald-300 hover:bg-emerald-50"
          >
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-neutral-500">
            <span className="h-px flex-1 bg-neutral-200" />
            Or log in with email
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-emerald-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 pr-16 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-600 hover:text-emerald-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {!error && params.get("reset") === "1" && (
              <p role="status" className="text-sm text-emerald-700">
                Password updated. Log in with your new password.
              </p>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 text-white rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-emerald-800 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in \u2192"}
            </button>
          </form>

          <p className="mt-6 text-xs text-neutral-500">
            By logging in, you agree to our{" "}
            <Link href="/terms" className="text-emerald-700 underline hover:text-emerald-800">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-emerald-700 underline hover:text-emerald-800">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}