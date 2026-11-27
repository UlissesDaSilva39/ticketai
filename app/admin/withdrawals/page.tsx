import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth/require-admin";
import WithdrawalList from "./WithdrawalList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Withdrawals | GRID admin" };

export default async function AdminWithdrawalsPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin/withdrawals");
  if (!(await isAdmin(user.id))) redirect("/unauthorized");

  const admin = createAdminClient();
  const { data: rows, error } = await admin.from("marketplace_payouts").select("id, seller_id, amount_pence, status, created_at").eq("status", "requested").order("created_at", { ascending: true }).limit(200);
  const ids = [...new Set((rows ?? []).map((r) => r.seller_id))];
  const [{ data: people }, accountsRes] = await Promise.all([
    ids.length ? admin.from("profiles").select("id, full_name, username").in("id", ids) : Promise.resolve({ data: [] as { id: string; full_name: string | null; username: string | null }[] }),
    ids.length ? admin.from("payout_accounts").select("user_id, payouts_enabled").in("user_id", ids) : Promise.resolve({ data: [] as { user_id: string; payouts_enabled: boolean }[], error: null }),
  ]);
  const byId = new Map((people ?? []).map((p) => [p.id, p]));
  const connected = new Set((accountsRes.data ?? []).filter((a) => a.payouts_enabled).map((a) => a.user_id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Withdrawals</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Members waiting to be paid. &quot;Pay with Stripe&quot; sends it to their connected bank; otherwise pay by bank transfer and mark it paid.</p>
        {error ? (
          <p className="mt-6 text-gray-600">Withdrawals aren&apos;t set up yet.</p>
        ) : (
          <WithdrawalList
            rows={(rows ?? []).map((r) => {
              const p = byId.get(r.seller_id);
              return { ...r, name: (p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username) ?? "Member", username: p?.username ?? null, connected: connected.has(r.seller_id) };
            })}
          />
        )}
      </div>
    </div>
  );
}
