import { createClient } from "@/lib/supabase/client";

type NotifyInput = {
  userId: string;
  type: string;
  title: string;
  body?: string | null;
  href?: string | null;
};

export async function notify({ userId, type, title, body, href }: NotifyInput) {
  const supabase = createClient();
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body: body ?? null,
    href: href ?? null,
  });
  if (error) {
    console.error("[notify] insert failed:", error.message);
    return false;
  }
  return true;
}
