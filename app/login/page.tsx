"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "attendee" | "promoter" | "venue" | "artist";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("attendee");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

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
              router.replace(
                r === "promoter"
                  ? "/promoter/dashboard"
                  : r === "venue"
                  ? "/venue/dashboard"
                  : r === "artist"
                  ? "/artist/register"
                  : "/my-tickets"
              );
            });
        }
      } else {
        setChecking(false);
      }
    });
  }, [router, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (signUpData.user) {
          await supabase.from("profiles").upsert({
            id: signUpData.user.id,
            role,
          });

          if (role === "promoter") {
            await supabase.from("promoters").upsert(
              {
                user_id: signUpData.user.id,
                display_name: email.split("@")[0],
              },
              { onConflict: "user_id" }
            );
          }
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      if (next) {
        router.push(next);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();
          const r = profile?.role as Role | undefined;
          router.push(
            r === "promoter"
              ? "/promoter/dashboard"
              : r === "venue"
              ? "/venue/dashboard"
              : "/my-tickets"
          );
        } else {
          router.push("/my-tickets");
        }
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1
        className="text-5xl font-bold mb-2"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
      </h1>
      <p className="text-gray-500 mb-8">
        {mode === "login"
          ? "Welcome back."
          : "Create an account in 30 seconds."}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              I want to...
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 rounded-lg border border-gray-300 p-3 cursor-pointer hover:border-black">
                <input
                  type="radio"
                  name="role"
                  value="attendee"
                  checked={role === "attendee"}
                  onChange={() => setRole("attendee")}
                />
                <span className="text-sm">Buy tickets to events</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-300 p-3 cursor-pointer hover:border-black">
                <input
                  type="radio"
                  name="role"
                  value="promoter"
                  checked={role === "promoter"}
                  onChange={() => setRole("promoter")}
                />
                <span className="text-sm">Promote events (earn commission)</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-300 p-3 cursor-pointer hover:border-black">
                <input
                  type="radio"
                  name="role"
                  value="venue"
                  checked={role === "venue"}
                  onChange={() => setRole("venue")}
                />
                <span className="text-sm">List my venue</span>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-gray-300 p-3 cursor-pointer hover:border-black">
                <input
                  type="radio"
                  name="role"
                  value="artist"
                  checked={role === "artist"}
                  onChange={() => setRole("artist")}
                />
                <span className="text-sm">Register as an artist</span>
              </label>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign In"
            : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        {mode === "login" ? "No account? " : "Have an account? "}
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="font-medium text-black underline"
        >
          {mode === "login" ? "Create one" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-500">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
