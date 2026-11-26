import { createServerSupabase } from "@/lib/supabase/server";

// Server-only helpers for GRID Newsletters.

export const UUID = /^[0-9a-f-]{36}$/i;
export const MAX_NEWSLETTERS_PER_MEMBER = 5;

export async function currentUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/** Only images uploaded to GRID's public post-media bucket can be covers. */
export function ownCoverUrl(v: unknown): string | null {
  if (typeof v !== "string" || !v) return null;
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-media/`;
  return v.startsWith(base) && !v.includes("..") && v.length < 600 ? v : null;
}

export const displayName = (p: { full_name: string | null; username: string | null } | null | undefined) =>
  (p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username) || "GRID member";
