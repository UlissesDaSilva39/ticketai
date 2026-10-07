import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PrefKey =
  | "friend_request"
  | "friend_accepted"
  | "message"
  | "follow"
  | "event_booked"
  | "event_reminder"
  | "review_request"
  | "promo";

export type Prefs = Record<PrefKey, boolean>;

export const DEFAULT_PREFS: Prefs = {
  friend_request: true,
  friend_accepted: true,
  message: true,
  follow: true,
  event_booked: true,
  event_reminder: true,
  review_request: true,
  promo: false,
};

export const PREF_LABELS: Record<PrefKey, { label: string; hint: string }> = {
  friend_request:  { label: "Friend requests",   hint: "When someone wants to be your friend" },
  friend_accepted: { label: "Friend accepted",   hint: "When someone accepts your friend request" },
  message:         { label: "Messages",          hint: "New direct messages" },
  follow:          { label: "New followers",     hint: "When someone follows you" },
  event_booked:    { label: "Ticket confirmations", hint: "When you buy a ticket" },
  event_reminder:  { label: "Event reminders",   hint: "Before an event you have tickets for" },
  review_request:  { label: "Review requests",   hint: "After an event you attended" },
  promo:           { label: "Promotions",        hint: "Offers and recommendations" },
};

export async function loadPrefs(supabase: SupabaseClient, userId: string): Promise<Prefs> {
  const { data } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return { ...DEFAULT_PREFS };

  return {
    friend_request:  data.friend_request  ?? true,
    friend_accepted: data.friend_accepted ?? true,
    message:         data.message         ?? true,
    follow:          data.follow          ?? true,
    event_booked:    data.event_booked    ?? true,
    event_reminder:  data.event_reminder  ?? true,
    review_request:  data.review_request  ?? true,
    promo:           data.promo           ?? false,
  };
}

export async function savePrefs(supabase: SupabaseClient, userId: string, prefs: Prefs) {
  const { error } = await supabase
    .from("notification_preferences")
    .upsert(
      { user_id: userId, ...prefs, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  return error;
}

export async function getBrowserPrefs(userId: string): Promise<Prefs> {
  return loadPrefs(createClient(), userId);
}