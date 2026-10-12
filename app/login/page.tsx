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
          supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .maybeSingle()
            .then(({ data: profile }) => {
              const r = profile?.role as Role | undefined;
              router.replace("/home");
            });
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
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          await supabase
            .from("profiles")
            .upsert({ id: data.user.id, role }, { onConflict: "id" });
          if (role === "promoter") {
            await supabase
              .from("promoters")
              .upsert(
                {
                  user_id: data.user.id,
                  display_name: email.split("@")[0],
                },
                { onConflict: "user_id" }
              );
          }
        }
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }

      if (next) {
        router.push(next);
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();
          const r = profile?.role as Role | undefined;
          router.push("/home");
        } else {
          router.push("/home");
        }
      }
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong";
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
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: origin + (next || "/home") },
    });
    if (oauthError) setError(oauthError.message);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-white/10">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/85 to-black" />
        <Link
          href="/"
          className="relative text-2xl font-bold"
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          GRID
        </Link>
        <div className="relative space-y-8">
          <h2
            className="text-5xl xl:text-6xl font-bold leading-[0.95] tracking-tight"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Your music.
            <br />
            Your audience.
            <br />
            Your rules.
          </h2>
          <div className="space-y-4 text-sm text-white/60 max-w-sm">
            <div className="flex gap-4">
              <span
                className="text-white/30 shrink-0"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                01
              </span>
              <p>Artists get booked by promoters across the city.</p>
            </div>
            <div className="flex gap-4">
              <span
                className="text-white/30 shrink-0"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                02
              </span>
              <p>Promoters fill rooms. Venues get discovered.</p>
            </div>
            <div className="flex gap-4">
              <span
                className="text-white/30 shrink-0"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                03
              </span>
              <p>Fans find their next night out, instantly.</p>
            </div>
          </div>
        </div>
        <p className="relative text-xs text-white/30">
          ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© 2026 GRID. Discover ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Connect ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Create ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Book ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Grow
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="lg:hidden block text-center text-2xl font-bold mb-10"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            GRID
          </Link>

          <h1
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            {mode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}
          </h1>
          <p className="text-white/50 text-sm mb-10">
            {mode === "login"
              ? "Sign in to keep building your network on GRID."
              : "Free forever. No card needed. Two minutes to set up."}
          </p>

          {error && (
            <div className="mb-6 border border-red-500/40 bg-red-500/10 text-red-200 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs tracking-widest text-white/50 mb-3">
                  I AM A
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["attendee", "Fan"],
                      ["artist", "Artist"],
                      ["promoter", "Promoter"],
                      ["venue", "Venue"],
                    ] as [Role, string][]
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRole(val)}
                      className={
                        "px-4 py-3 rounded-xl border text-sm text-left transition " +
                        (role === val
                          ? "border-white bg-white text-black"
                          : "border-white/15 hover:border-white/40 text-white/80")
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs tracking-widest text-white/50 mb-2">
                EMAIL
              </label>
              <input
                type="email"
                required
                autoFocus
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/15 rounded-xl focus:border-white focus:outline-none text-white placeholder-white/30"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest text-white/50 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/[0.03] border border-white/15 rounded-xl focus:border-white focus:outline-none text-white placeholder-white/30"
                  placeholder="ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                  <input type="checkbox" className="accent-white" />
                  Keep me signed in
                </label>
                <Link
                  href="/forgot-password"
                  className="text-white/60 hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 disabled:opacity-50 transition"
            >
              {loading
                ? "Please waitÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦"
                : mode === "login"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/40 tracking-widest">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => oauth("google")}
              className="flex items-center justify-center gap-2 border border-white/15 hover:border-white/40 rounded-xl py-3 text-sm transition"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
                <path
                  fill="#fff"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#fff"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#fff"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#fff"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => oauth("apple")}
              className="flex items-center justify-center gap-2 border border-white/15 hover:border-white/40 rounded-xl py-3 text-sm transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden>
                <path d="M17.05 12.54c-.02-2.4 1.96-3.55 2.05-3.61-1.12-1.64-2.87-1.86-3.49-1.88-1.48-.15-2.89.87-3.64.87-.76 0-1.91-.85-3.14-.83-1.61.02-3.1.93-3.93 2.36-1.68 2.91-.43 7.21 1.21 9.56.8 1.15 1.76 2.44 3.02 2.39 1.21-.05 1.67-.78 3.13-.78 1.46 0 1.87.78 3.14.75 1.3-.02 2.12-1.17 2.92-2.32.92-1.33 1.3-2.62 1.32-2.68-.03-.01-2.53-.97-2.56-3.83zM14.5 4.5c.66-.8 1.11-1.91.99-3.02-.96.04-2.12.64-2.8 1.44-.61.71-1.15 1.85-1.01 2.94 1.07.08 2.16-.55 2.82-1.36z" />
              </svg>
              Apple
            </button>
          </div>

          <p className="text-center text-sm text-white/50 mt-10">
            {mode === "login" ? "No account?" : "Have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
              className="text-white font-medium underline"
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>

          <p className="text-center text-xs text-white/25 mt-6">
            Protected by Supabase Auth
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
