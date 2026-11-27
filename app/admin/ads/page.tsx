import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/require-admin";
import AdReview from "./AdReview";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ad review | GRID admin" };

export default async function AdminAdsPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin/ads");
  if (!(await isAdmin(user.id))) redirect("/unauthorized");

  const { data, error } = await createAdminClient()
    .from("ad_campaigns")
    .select("id, plan, headline, body, image_url, link_url, amount_pence, status, days, paid_at, impressions, clicks, ends_at")
    .in("status", ["in_review", "active"])
    .order("paid_at", { ascending: true })
    .limit(100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ad review</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Paid ads wait here. Approving starts the campaign now; rejecting refunds the advertiser in full.</p>
        {error ? <p className="mt-6 text-gray-600">Ads are not set up yet (run the promotions & ads database script).</p> : <AdReview rows={data ?? []} />}
      </div>
    </div>
  );
}
