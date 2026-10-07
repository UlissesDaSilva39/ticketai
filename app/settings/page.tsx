import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const items = [
    { href: "/settings/notifications", label: "Notifications", desc: "Choose what you want to hear about." },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-gray-600 mt-2 mb-8">Manage your account and preferences.</p>

      <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="block py-4 hover:bg-gray-50 -mx-4 px-4 transition-colors"
          >
            <p className="font-medium">{it.label}</p>
            <p className="text-sm text-gray-500 mt-0.5">{it.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}