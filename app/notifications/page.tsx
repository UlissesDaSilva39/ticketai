import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";
import NotificationList from "@/components/notifications/NotificationList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your GRID activity.",
};

export default async function NotificationsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: raw } = await supabase
    .from("notifications")
    .select("id, type, title, body, href, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const list = raw || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <nav aria-label="Your library" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>

        <main className="col-span-12 lg:col-span-9 space-y-6">
          <header>
            <h1 className="text-4xl font-bold uppercase mb-2" style={{ fontFamily: "var(--font-antonio)" }}>
              Notifications
            </h1>
            <p className="text-gray-600">
              {list.length === 0
                ? "You have no notifications."
                : "Your recent activity on GRID."}
            </p>
          </header>

          <NotificationList initial={list} />
        </main>
      </div>
    </div>
  );
}
