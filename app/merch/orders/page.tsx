import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const dynamic = "force-dynamic";
export const metadata = { title: "My merch orders" };

export default async function MerchOrdersPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen pb-32">
        <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3"><Sidebar /></div>
          <main className="col-span-12 lg:col-span-9 min-w-0">
            <h1 className="text-4xl font-bold uppercase mb-6" style={{ fontFamily: "var(--font-antonio)" }}>My orders</h1>
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-900 font-medium mb-3">Log in to see your orders</p>
              <Link href="/login?next=/merch/orders" className="inline-block rounded-full bg-black text-white text-sm font-semibold px-6 py-2 hover:bg-gray-800">Log in</Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { data: orders } = await supabase
    .from("merch_orders")
    .select("id, merch_id, quantity, amount_pence, currency, status, created_at, paid_at")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(60);

  const rows = orders || [];

  const productIds = Array.from(new Set(rows.map((r) => r.merch_id)));
  let productMap: Record<string, { title: string; image_url: string | null }> = {};
  if (productIds.length > 0) {
    const { data: prods } = await supabase
      .from("merch")
      .select("id, title, image_url")
      .in("id", productIds);
    for (const p of prods || []) productMap[p.id] = p;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3"><Sidebar /></div>
        <main className="col-span-12 lg:col-span-9 min-w-0">
          <h1 className="text-4xl font-bold uppercase mb-6" style={{ fontFamily: "var(--font-antonio)" }}>
            My orders ({rows.length})
          </h1>

          {rows.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-900 font-medium mb-1">No orders yet</p>
              <p className="text-gray-600 text-sm">Products you buy will show up here.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
              {rows.map((o) => {
                const p = productMap[o.merch_id];
                const symbol = o.currency === "USD" ? "$" : o.currency === "EUR" ? "\u20AC" : "\u00A3";
                return (
                  <div key={o.id} className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {p?.image_url ? (
                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">{p?.title?.charAt(0) || "?"}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{p?.title || "Product"}</p>
                      <p className="text-xs text-gray-500">
                        Qty {o.quantity} · {symbol}{(o.amount_pence / 100).toFixed(2)} ·{" "}
                        {new Date(o.created_at).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <span
                      className={
                        "text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-1 " +
                        (o.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : o.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : o.status === "refunded"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-red-100 text-red-700")
                      }
                    >
                      {o.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}