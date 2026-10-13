import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <nav aria-label="Your library" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>

        <main className="col-span-12 lg:col-span-9 space-y-6">
          <h1 className="text-4xl font-bold uppercase mb-2" style={{ fontFamily: "var(--font-antonio)" }}>Payments</h1>
          <Link href="/settings" className="text-sm text-gray-500 hover:text-black">&larr; Back to settings</Link>
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-600">Coming soon.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
