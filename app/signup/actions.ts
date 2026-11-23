"use server";

import { headers } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Matches the check constraint on public.profiles.role ('fan','artist','industry').
export type ProfileRole = "fan" | "artist" | "industry";

type SignupInput = {
  email: string;
  password: string;
  full_name: string;
  role: ProfileRole;
  username?: string;
  city?: string;
};

export type SignupResult =
  | { ok: true; needsConfirmation: boolean }
  | { ok?: false; error: string };

const ROLES: ProfileRole[] = ["fan", "artist", "industry"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9_.-]+/g, "")
    .slice(0, 24);
}

/** Picks a free username based on the requested one, the name or the email. */
async function pickUsername(
  admin: ReturnType<typeof createAdminClient>,
  preferred: string
) {
  const base = slugify(preferred) || "user";
  for (let attempt = 0; attempt < 6; attempt++) {
    const candidate =
      attempt === 0 ? base : `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    const { data } = await admin
      .from("profiles")
      .select("id")
      .eq("username", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  return `${base}${Date.now().toString(36)}`;
}

export async function signUp(input: SignupInput): Promise<SignupResult> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const full_name = input.full_name.trim();
  const role = input.role;
  const city = (input.city ?? "").trim();

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (!full_name) return { error: "Please enter your full name." };
  if (!ROLES.includes(role)) return { error: "Please choose who you are." };

  const requested = (input.username ?? "").trim().toLowerCase();
  if (requested && !/^[a-z0-9_.-]{1,30}$/.test(requested)) {
    return { error: "Username may only contain letters, numbers, dot, dash, underscore." };
  }

  const admin = createAdminClient();
  const username = await pickUsername(admin, requested || full_name || email.split("@")[0]);

  // Signing up through the cookie-aware client logs the user in straight away
  // when email confirmation is off in Supabase.
  // The confirmation email links back here, so it works on any port/domain.
  const h = await headers();
  const origin =
    h.get("origin") ??
    `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host")}`;

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, username, role },
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
    },
  });

  if (error) {
    if (error.code === "user_already_exists" || /already registered/i.test(error.message)) {
      return { error: "An account with this email already exists. Try logging in." };
    }
    return { error: error.message };
  }
  if (!data.user) return { error: "Could not create your account. Please try again." };

  // Supabase returns a user with no identities when the email is already registered.
  if (data.user.identities && data.user.identities.length === 0) {
    return { error: "An account with this email already exists. Try logging in." };
  }

  // Service role: works even before the user has a session (email confirmation on),
  // and upsert keeps it safe if a database trigger already created the row.
  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: data.user.id,
      username,
      full_name,
      role,
      city: city || null,
      is_public: true,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    console.error("[signup] profile upsert failed:", profileError);
    return { error: "Your account was created, but setting up your profile failed. Please contact support." };
  }

  return { ok: true, needsConfirmation: !data.session };
}
