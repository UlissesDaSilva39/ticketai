import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order confirmed" };

export default async function MerchSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const supabase = await createServerSupabase();

  let order: {
    id: string;
    merch_id: string;
    quantity: number;
    amount_pence: number;
    currency: string;
    status: string;
  } | null = null;

  let product: { title: string; image_url: string | null } | null = null;

  if (session_id) {
    const { data } = await supabase
      .from("merch_orders")
      .select("id, merch_id, quantity, amount_pence, currency, status")
      .eq("stripe_session_id", session_id)
      .maybeSingle();
    order = data;

    if (data?.merch_id) {
      const { data: p } = await supabase
        .from("merch")
        .select("title, image_url")
        .eq("id", data.merch_id)
        .maybeSingle();
      product = p;
    }
  }

  const symbol = order?.currency === "USD" ? "$" : order?.currency === "EUR" ? "\u20AC" : "\u00A3";

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>
        <main className="col-span-12 lg:col-span-9 min-w-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h1 className="text-3xl font-bold mt-4" style={{ fontFamily: "var(--font-antonio)" }}>
              Order confirmed
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Thanks! The artist has been notified and will ship your order soon.
            </p>

            {order && product ? (
              <div className="mt-6 text-left border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-gray-400">
                        {product.title.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{product.title}</p>
                    <p className="text-xs text-gray-500">
                      Qty {order.quantity} · {symbol}{(order.amount_pence / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Order ID: <span className="font-mono">{order.id.slice(0, 8)}</span>
                </p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/merch/orders" className="rounded-full bg-black text-white text-sm font-semibold px-6 py-2 hover:bg-gray-800">
                My orders
              </Link>
              <Link href="/artists" className="rounded-full bg-white border border-gray-300 text-gray-800 text-sm font-semibold px-6 py-2 hover:border-gray-400">
                Continue browsing
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}