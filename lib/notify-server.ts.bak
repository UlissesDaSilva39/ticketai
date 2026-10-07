import { createServerSupabase } from "@/lib/supabase/server";

type NotifyInput = {
  userId: string;
  type: string;
  title: string;
  body?: string | null;
  href?: string | null;
};

export async function notifyServer({ userId, type, title, body, href }: NotifyInput) {
  const supabase = await createServerSupabase();

  // Respect notification preferences
  const { data: prefs } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (prefs) {
    const allowed = (prefs as Record<string, unknown>)[type];
    if (allowed === false) {
      return true; // silently skipped by user preference
    }
  }

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body: body ?? null,
    href: href ?? null,
  });

  if (error) {
    console.error("[notifyServer] insert failed:", error.message);
    return false;
  }
  return true;
}