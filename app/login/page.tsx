"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "attendee" | "promoter" | "venue" | "artist";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "";
  const roleParam = (searchParams.get("role") as Role | null) || null;

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(roleParam || "attendee");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        if (next) {
          router.replace(next);
        } else {
          router.replace("/home");
        }
      } else {
        setChecking(false);
      }
    });
  }, [router, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (data.user) {
          await supabase.from("profiles").upsert({ id: data.user.id, role }, { onConflict: "id" });
          if (role === "promoter") {
            await supabase.from("promoters").upsert({ user_id: data.user.id, display_name: email.split("@")[0] }, { onConflict: "user_id" });
          }
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      if (next) {
        router.push(next);
      } else {
        router.push("/home");
      }
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (/invalid/i.test(msg) || /credentials/i.test(msg)) {
        setError("Invalid email or password.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const oauth = async (provider: "google" | "apple") => {
    setError("");
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: origin + (next || "/home") } });
    if (oauthError) setError(oauthError.message);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-black">
      <div className="relative hidden lg:flex flex-col justify-between p-12 border-r border-gray-200 bg-gray-50">
        <Link href="/" className="relative text-2xl font-bold text-black" style={{ fontFamily: "var(--font-antonio)" }}>
          GRID
        </Link>
        <div className="relative space-y-8">
          <h2 className="text-5xl xl:text-6xl font-bold leading-[0.95] tracking-tight text-black" style={{ fontFamily: "var(--font-antonio)" }}>
            Your music.
            <br />
            Your audience.
            <br />
            Your rules.
          </h2>
          <div className="space-y-4 text-sm text-gray-600 max-w-sm">
            <div className="flex gap-4">
              <span className="text-gray-400 shrink-0" style={{ fontFamily: "var(--font-antonio)" }}>01</span>
              <p>Artists get booked by promoters across the city.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-400 shrink-0" style={{ fontFamily: "var(--font-antonio)" }}>02</span>
              <p>Promoters fill rooms. Venues get discovered.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-400 shrink-0" style={{ fontFamily: "var(--font-antonio)" }}>03</span>
              <p>Fans find their next night out, instantly.</p>
            </div>
          </div>
        </div>
        <p className="relative text-xs text-gray-400">
          2026 GRID - Discover - Connect - Create - Book - Grow
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden block text-center text-2xl font-bold mb-10 text-black" style={{ fontFamily: "var(--font-antonio)" }}>
            GRID
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-black" style={{ fontFamily: "var(--font-antonio)" }}>
            {mode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            {mode === "login"
              ? "Sign in to keep building your network on GRID."
              : "Free forever. No card needed. Two minutes to set up."}
          </p>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs tracking-widest text-gray-500 mb-3">I AM A</label>
                <div className="grid grid-cols-2 gap-2">
                  {([["attendee","Fan"],["artist","Artist"],["promoter","Promoter"],["venue","Venue"]] as [Role,string][]).map(([val, label]) => (
                    <button key={val} type="button" onClick={() => setRole(val)} className={"px-4 py-3 rounded-xl border text-sm text-left transition " + (role === val ? "border-black bg-black text-white" : "border-gray-300 hover:border-gray-800 text-gray-700")}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs tracking-widest text-gray-500 mb-2">EMAIL</label>
              <input type="email" required autoFocus autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:outline-none text-black placeholder-gray-400" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-xs tracking-widest text-gray-500 mb-2">PASSWORD</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 pr-16 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:outline-none text-black placeholder-gray-400" placeholder="password" />
                <button type="button" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-medium">
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="accent-black" />
                  Keep me signed in
                </label>
                <Link href="/forgot-password" className="text-gray-600 hover:text-black">
                  Forgot password?
                </Link>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition">
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 tracking-widest">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => oauth("google")} className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-800 rounded-xl py-3 text-sm transition text-black">Google</button>
            <button type="button" onClick={() => oauth("apple")} className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-800 rounded-xl py-3 text-sm transition text-black">Apple</button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-10">
            {mode === "login" ? "No account?" : "Have an account?"}{" "}
            <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="text-black font-medium underline">
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>

          <p className="text-center text-xs text-gray-400 mt-6">Protected by Supabase Auth</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white text-black flex items-center justify-center"><p className="text-gray-500 text-sm">Loading...</p></div>}>
      <LoginInner />
    </Suspense>
  );
}
