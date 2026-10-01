import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PromoterEventRow = {
  id: string;
  event_id: string;
  referral_code: string;
  clicks: number;
  conversions: number;
  revenue: number;
  commission_rate: number;
  events: { title: string; start_date: string } | null;
};

export default async function PromoterAnalytics() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: promoter } = await supabase
    .from("promoters")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!promoter) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-gray-500 mb-6">You are not registered as a promoter.</p>
        <Link href="/promoter/dashboard" className="inline-block px-8 py-4 bg-black text-white font-medium rounded-full">
          Become a Promoter
        </Link>
      </div>
    );
  }

  const { data: raw } = await supabase
    .from("promoter_events")
    .select("*, events:event_id(title, start_date)")
    .eq("promoter_id", promoter.id)
    .order("created_at", { ascending: false });

  const list = (raw as unknown as PromoterEventRow[]) || [];

  const totalClicks = list.reduce((s, pe) => s + Number(pe.clicks || 0), 0);
  const totalSales = list.reduce((s, pe) => s + Number(pe.conversions || 0), 0);
  const totalRevenue = list.reduce((s, pe) => s + Number(pe.revenue || 0), 0);
  const conversionRate = totalClicks > 0 ? (totalSales / totalClicks) * 100 : 0;
  const avgCommission = list.length > 0 ? list.reduce((s, pe) => s + Number(pe.commission_rate || 0), 0) / list.length : 0;

  const sorted = [...list].sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/promoter/dashboard" className="text-sm text-gray-500 hover:text-black">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>
        ANALYTICS
      </h1>
      <p className="text-gray-500 mb-10">Your promoter performance</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Clicks</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{totalClicks}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Sales</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{totalSales}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Conversion</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{conversionRate.toFixed(1)}%</p>
        </div>
        <div className="bg-[#00FF87] rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest mb-2">Earned</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>£{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-12">
        <p className="text-sm text-gray-500">
          Your average commission rate is <span className="font-bold text-black">{avgCommission.toFixed(1)}%</span>.
          Every 100 clicks generates approximately <span className="font-bold text-black">{conversionRate.toFixed(1)}</span> sales.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-antonio)" }}>
        EVENT BREAKDOWN
      </h2>

      {sorted.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-6">You are not promoting any events yet.</p>
          <Link href="/promoter/events" className="inline-block px-8 py-4 bg-black text-white font-medium rounded-full">
            Find Events to Promote
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((pe) => {
            const clicks = Number(pe.clicks || 0);
            const sales = Number(pe.conversions || 0);
            const rate = clicks > 0 ? (sales / clicks) * 100 : 0;
            return (
              <div key={pe.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="font-bold text-lg mb-1">{pe.events?.title || "Event"}</h3>
                    <p className="text-xs text-gray-500 font-mono">{pe.referral_code}</p>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Clicks</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{clicks}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Sales</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{sales}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Rate</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{rate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Earned</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>£{Number(pe.revenue).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#00FF87] h-full rounded-full transition-all" style={{ width: Math.min(rate * 4, 100) + "%" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

