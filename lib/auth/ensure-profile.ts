import type { SupabaseClient, User } from "@supabase/supabase-js";

/** Roles allowed by the profiles.role check constraint. */
export type ProfileRole = "fan" | "artist" | "industry";

export function toProfileRole(value: unknown): ProfileRole {
  if (value === "artist" || value === "producer") return "artist";
  // Venues, promoters, labels and A&R all sign up as "industry".
  if (value === "industry" || value === "venue" || value === "promoter" || value === "label") return "industry";
  return "fan";
}

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  return base || "user";
}

async function uniqueUsername(supabase: SupabaseClient, name: string): Promise<string> {
  const base = slugify(name);
  for (let i = 0; i < 5; i++) {
    const candidate = i === 0 ? base : `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data } = await supabase.from("profiles").select("id").eq("username", candidate).maybeSingle();
    if (!data) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Creates the user's profile row if it does not exist yet.
 * Must run with a signed-in session (RLS only lets users insert their own row).
 * `fallbackRole` is used for Google sign-ups, where the role comes from the URL.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
  fallbackRole?: string | null
): Promise<{ error?: string }> {
  const { data: existing } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (existing) return {};

  const meta = user.user_metadata ?? {};
  const fullName: string =
    (meta.full_name as string) || (meta.name as string) || user.email?.split("@")[0] || "GRID member";
  const role = toProfileRole(meta.role ?? fallbackRole);

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    username: await uniqueUsername(supabase, fullName),
    full_name: fullName,
    avatar_url: (meta.avatar_url as string) || null,
    role,
    is_public: true,
  });

  return error ? { error: error.message } : {};
}
