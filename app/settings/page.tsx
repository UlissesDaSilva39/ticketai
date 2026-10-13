import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account.",
};

export default async function SettingsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, role, is_public")
    .eq("id", user.id)
    .maybeSingle();

  const sections = [
    {
      href: "/settings/notifications",
      title: "Notifications",
      description: "Choose what you get notified about",
    },
    {
      href: "/profile/edit",
      title: "Profile",
      description: "Your name, avatar, bio, links",
    },
    {
      href: "/settings/payments",
      title: "Payments",
      description: "Connect Stripe to receive payouts",
    },
    {
      href: "/settings/privacy",
      title: "Privacy",
      description: "Control who can see your profile",
    },
    {
      href: "/settings/account",
      title: "Account",
      description: "Email, password, and account deletion",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <nav aria-label="Your library" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>

        <main className="col-span-12 lg:col-span-9 space-y-6">
          <header>
            <h1 className="text-4xl font-bold uppercase mb-2" style={{ fontFamily: "var(--font-antonio)" }}>
              Settings
            </h1>
            <p className="text-gray-600">
              Signed in as {profile?.username || user.email}
            </p>
          </header>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition"
                >
                  <p className="font-bold text-base">{s.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
