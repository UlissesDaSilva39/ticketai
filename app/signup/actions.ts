"use server";

import { headers } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureProfile, toProfileRole } from "@/lib/auth/ensure-profile";

export type SignupState =
  | { status: "idle" }
  | { status: "error"; message: string; field?: "full_name" | "email" | "password" }
  | { status: "check_email"; email: string }
  | { status: "redirect"; to: string };

async function siteOrigin(): Promise<string> {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signUp(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = toProfileRole(formData.get("role"));

  if (full_name.length < 2) return { status: "error", field: "full_name", message: "Enter your full name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { status: "error", field: "email", message: "Enter a valid email address." };
  if (password.length < 8)
    return { status: "error", field: "password", message: "Password must be at least 8 characters." };

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Saved on the auth user so the profile can be created after email confirmation.
      data: { full_name, role },
      emailRedirectTo: `${await siteOrigin()}/auth/callback?next=/onboarding`,
    },
  });

  if (error) {
    const msg = /already registered|already exists/i.test(error.message)
      ? "An account with this email already exists. Try logging in."
      : error.message;
    return { status: "error", field: "email", message: msg };
  }

  // Email confirmation is on: the profile is created in /auth/callback once they click the link.
  if (!data.session || !data.user) return { status: "check_email", email };

  const { error: profileError } = await ensureProfile(supabase, data.user);
  if (profileError) {
    return { status: "error", message: "Your account was created but we couldn't set up your profile. Please log in to retry." };
  }
  return { status: "redirect", to: "/onboarding" };
}
