"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signUp, type SignupState } from "./actions";

type Role = "artist" | "industry";

const ROLES: { id: Role; label: string; hint: string }[] = [
  { id: "artist", label: "Artist / Producer", hint: "Find gigs and collabs" },
  { id: "industry", label: "Venue / A&R", hint: "Book and sign talent" },
];

const inputClass =
  "w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500";

export default function SignupForm({ initialRole }: { initialRole: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [state, formAction, pending] = useActionState<SignupState, FormData>(signUp, { status: "idle" });

  useEffect(() => {
    if (state.status === "redirect") {
      router.push(state.to);
      router.refresh();
    }
  }, [state, router]);

  async function continueWithGoogle() {
    setGoogleLoading(true);
    setGoogleError("");
    const redirectTo = `${window.location.origin}/auth/callback?next=/onboarding&role=${role}`;
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) {
      setGoogleError(error.message);
      setGoogleLoading(false);
    }
  }

  if (state.status === "check_email") {
    return (
      <div className="text-center" role="status">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-2xl">
          ✉
        </div>
        <h2 className="text-2xl font-bold mb-2">Check your email</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We sent a confirmation link to <strong>{state.email}</strong>. Click it to finish creating your account.
        </p>
        <p className="mt-6 text-sm text-gray-500">
          Wrong address?{" "}
          <button onClick={() => router.refresh()} className="font-semibold text-purple-600 hover:underline">
            Start again
          </button>
        </p>
      </div>
    );
  }

  const fieldError = (f: "full_name" | "email" | "password") =>
    state.status === "error" && state.field === f ? state.message : "";
  const formError = state.status === "error" && !state.field ? state.message : "";
  const borderFor = (f: "full_name" | "email" | "password") =>
    fieldError(f) ? "border-red-500" : "border-gray-300 dark:border-gray-700";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Create your account</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-purple-600 hover:underline">
          Log in
        </Link>
      </p>

      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={googleLoading || pending}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        {googleLoading ? "Opening Google…" : "Continue with Google"}
      </button>
      {googleError && <p className="mt-2 text-sm text-red-600">{googleError}</p>}

      <div className="flex items-center gap-3 my-6 text-sm text-gray-500">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        Or sign up with email
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <form action={formAction} noValidate className="space-y-5">
        <fieldset>
          <legend className="block text-sm font-semibold mb-2">I am a…</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <label
                key={r.id}
                className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-purple-500 ${
                  role === r.id
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.id}
                  checked={role === r.id}
                  onChange={() => setRole(r.id)}
                  className="sr-only"
                />
                <span className="block font-semibold text-sm">{r.label}</span>
                <span className="block text-xs text-gray-500 mt-0.5">{r.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold mb-1.5">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            autoComplete="name"
            required
            aria-invalid={!!fieldError("full_name")}
            aria-describedby={fieldError("full_name") ? "full_name-error" : undefined}
            className={`${inputClass} ${borderFor("full_name")}`}
          />
          {fieldError("full_name") && (
            <p id="full_name-error" className="mt-1 text-sm text-red-600">
              {fieldError("full_name")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!fieldError("email")}
            aria-describedby={fieldError("email") ? "email-error" : undefined}
            className={`${inputClass} ${borderFor("email")}`}
          />
          {fieldError("email") && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {fieldError("email")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              required
              aria-invalid={!!fieldError("password")}
              aria-describedby="password-help"
              className={`${inputClass} pr-16 ${borderFor("password")}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p id="password-help" className={`mt-1 text-sm ${fieldError("password") ? "text-red-600" : "text-gray-500"}`}>
            {fieldError("password") || "At least 8 characters."}
          </p>
        </div>

        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 text-sm">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || googleLoading}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create free account →"}
        </button>

        <p className="text-xs text-center text-gray-500">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
