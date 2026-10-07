import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import NotificationPreferencesForm from "@/components/NotificationPreferencesForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notification settings",
  description: "Choose which notifications you receive.",
};

export default async function NotificationSettingsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: prefsRow } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const initial = prefsRow
    ? {
        friend_request:  prefsRow.friend_request  ?? true,
        friend_accepted: prefsRow.friend_accepted ?? true,
        message:         prefsRow.message         ?? true,
        follow:          prefsRow.follow          ?? true,
        event_booked:    prefsRow.event_booked    ?? true,
        event_reminder:  prefsRow.event_reminder  ?? true,
        review_request:  prefsRow.review_request  ?? true,
        promo:           prefsRow.promo           ?? false,
      }
    : {
        friend_request: true, friend_accepted: true, message: true, follow: true,
        event_booked: true, event_reminder: true, review_request: true, promo: false,
      };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/settings" className="text-sm text-gray-500 hover:underline">
        ← Back to settings
      </Link>
      <h1 className="text-3xl font-bold mt-4">Notifications</h1>
      <p className="text-gray-600 mt-2 mb-8">
        Choose what you want to hear about. Turning off in-app notifications also stops emails for that type.
      </p>

      <NotificationPreferencesForm userId={user.id} initial={initial} />
    </div>
  );
}