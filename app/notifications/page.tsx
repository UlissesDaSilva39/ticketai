import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import NotificationsList, { type NotificationRow } from "./NotificationsList";

// Real notifications (table: notifications). Replaces a hard-coded mock-up.
export const metadata: Metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/notifications");

  const { data } = await supabase
    .from("notifications")
    .select("id, type, title, body, href, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return <NotificationsList initial={(data ?? []) as NotificationRow[]} />;
}
