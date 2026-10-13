"use server";

import { createServerSupabase } from "@/lib/supabase/server";

type SignupInput = {
  email: string;
  password: string;
  full_name: string;
  username: string;
  role: "artist" | "promoter" | "venue" | "attendee";
  city: string;
};

export async function signUp(input: SignupInput) {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const full_name = input.full_name.trim();
  const username = input.username.trim().toLowerCase();
  const role = input.role;
  const city = input.city.trim();

  if (!email || !password) return { error: "Email and password required" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };
  if (!full_name) return { error: "Full name required" };
  if (!username) return { error: "Username required" };
  if (!/^[a-z0-9_.-]+$/.test(username)) {
    return { error: "Username may only contain letters, numbers, dot, dash, underscore" };
  }
  if (username.length > 30) return { error: "Username too long" };

  const supabase = await createServerSupabase();

  // Check username availability
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) return { error: "Username already taken" };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, username },
    },
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Could not create account" };

  // Create profile row
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    username,
    full_name,
    role,
    city: city || null,
    is_public: true,
  });

  if (profileError) {
    return { error: "Account created but profile setup failed: " + profileError.message };
  }

  return { ok: true };
}
