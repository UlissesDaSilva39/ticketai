"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MAX_LEN = {
  full_name: 80,
  username: 30,
  bio: 500,
  city: 80,
  genre: 60,
  website: 200,
  instagram: 80,
  twitter: 80,
  spotify: 200,
  youtube: 200,
  soundcloud: 200,
  avatar_url: 500,
  cover_image: 500,
} as const;

type Field = keyof typeof MAX_LEN;

export async function updateProfile(formData: FormData) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const patch: Record<string, unknown> = {};

  for (const [key, max] of Object.entries(MAX_LEN) as [Field, number][]) {
    const raw = formData.get(key);
    if (raw === null) continue;
    const value = String(raw).trim();
    if (value.length > max) return { error: key + " is too long (max " + max + ")" };
    patch[key] = value === "" ? null : value;
  }

  const isPublicRaw = formData.get("is_public");
  if (isPublicRaw !== null) patch.is_public = String(isPublicRaw) === "true";

  if (typeof patch.username === "string" && patch.username.length > 0) {
    if (!/^[a-z0-9_.-]+$/i.test(patch.username)) {
      return { error: "Username may only contain letters, numbers, dot, dash, underscore" };
    }
    const { data: clash } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", patch.username)
      .neq("id", user.id)
      .maybeSingle();
    if (clash) return { error: "Username already taken" };
  }

  if (Object.keys(patch).length === 0) return { error: "Nothing to update" };

  const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  return { ok: true };
}
