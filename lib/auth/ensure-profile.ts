import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Roles allowed by the live profiles_role_check constraint:
 * attendee, promoter, venue, artist, a_and_r, record_company, admin.
 * (admin is never assignable at sign-up.)
 */
export type ProfileRole = "attendee" | "promoter" | "venue" | "artist" | "a_and_r" | "record_company";

export function toProfileRole(value: unknown): ProfileRole {
  switch (value) {
    case "artist":
    case "producer":
      return "artist";
    case "venue":
      return "venue";
    case "promoter":
      return "promoter";
    case "a_and_r":
    case "label":
    case "record_company":
      return "a_and_r";
    default:
      return "attendee";
  }
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
