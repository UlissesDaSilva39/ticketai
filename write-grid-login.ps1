# write-grid-login.ps1
$ErrorActionPreference = "Stop"
$root = (Get-Location).Path

# Detect app dir
$appDir = "app"
if (-not (Test-Path "$root\app") -and (Test-Path "$root\src\app")) { $appDir = "src\app" }

$loginDir = "$root\$appDir\login"
New-Item -ItemType Directory -Path $loginDir -Force | Out-Null
$loginPath = "$loginDir\page.tsx"

$pageCode = @"
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
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
        setError(data.message ?? "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to home on success
      router.push("/home");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Brand */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#0a291c] p-12 text-white lg:flex">
        <div>
          <div className="text-3xl font-bold tracking-tight">GRID</div>
        </div>

        <div className="max-w-md">
          <h1 className="mb-4 text-5xl font-serif">Welcome back.</h1>
          <p className="mb-12 text-lg text-gray-300">
            Your next collab, gig, or booking is waiting.
          </p>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="mb-6 text-sm italic text-gray-200">
              "GRID helped me land a £2,000 sync deal within two weeks."
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 font-bold text-white">
                S
              </div>
              <div>
                <div className="text-sm font-semibold">Sarah Jenkins</div>
                <div className="text-xs text-gray-400">Vocalist · London</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
            N
          </div>
          <span>© 2026 GRID Corporation. All rights reserved.</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center bg-[#f9f8f6] p-8 lg:w-1/2 lg:p-24">
        <div className="mx-auto w-full max-w-md">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Log in to GRID</h2>
          <p className="mb-8 text-sm text-gray-600">
            New here?{" "}
            <Link href="/register" className="font-semibold text-green-700 hover:underline">
              Create an account
            </Link>
          </p>

          <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#f9f8f6] px-2 text-gray-500">Or log in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-green-700 hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-600" />
              Remember me for 30 days
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-[#0a8a4a] py-3 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in →"}
            </button>
          </form>

          <div className="mt-8 rounded-lg border border-yellow-200 bg-[#fff9e6] p-4">
            <div className="mb-1 text-xs font-bold text-yellow-800">DEMO LOGIN</div>
            <div className="text-sm text-yellow-700">
              Use any email and password to log in as Ulisses Silva.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"@

[System.IO.File]::WriteAllText($loginPath, $pageCode, [System.Text.UTF8Encoding]::new($false))
Write-Host "  [wrote] $appDir\login\page.tsx" -ForegroundColor Green

# Ensure cache is clear
if (Test-Path "$root\.next") {
    try {
        Remove-Item "$root\.next" -Recurse -Force -ErrorAction Stop
        Write-Host "  [cache] .next cleared" -ForegroundColor Green
    } catch {
        Write-Host "  [cache] Stop dev server to clear .next" -ForegroundColor Yellow
    }
}

Write-Host "`n=== DONE ===" -ForegroundColor Cyan
Write-Host "Your original GRID login page has been written."
Write-Host "Run: npm run dev"
Write-Host "Then open: http://localhost:3000/login"
