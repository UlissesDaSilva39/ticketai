import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PayoutRow = {
  id: string;
  amount: number;
  status: string;
  method: string | null;
  reference: string | null;
  notes: string | null;
  requested_at: string;
  paid_at: string | null;
  promoter_id: string;
  promoters: {
    display_name: string | null;
    payout_email: string | null;
    payout_account_name: string | null;
    payout_sort_code: string | null;
    payout_account_number: string | null;
    user_id: string;
  } | null;
};

export default async function AdminPayoutsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Not Authorized</h1>
        <p className="text-gray-500">You do not have admin access.</p>
      </div>
    );
  }

  const { data: payouts } = await supabase
    .from("promoter_payouts")
    .select("*, promoters:promoter_id(display_name, payout_email, payout_account_name, payout_sort_code, payout_account_number, user_id)")
    .order("created_at", { ascending: false });

  const list = (payouts as unknown as PayoutRow[]) || [];
  const pending = list.filter((p) => p.status === "pending");
  const paid = list.filter((p) => p.status === "paid");
  const totalPendingAmount = pending.reduce((s, p) => s + Number(p.amount || 0), 0);
  const totalPaidAmount = paid.reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>ADMIN · PAYOUTS</h1>
      <p className="text-gray-500 mb-10">Review and mark payouts as paid.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Pending</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{pending.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-yellow-700 mb-2">Pending £</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{"£" + totalPendingAmount.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Paid</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{paid.length}</p>
        </div>
        <div className="bg-[#00FF87] rounded-lg p-6">
          <p className="text-xs uppercase tracking-widest mb-2">Total Paid</p>
          <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{"£" + totalPaidAmount.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-antonio)" }}>PENDING PAYOUTS</h2>

      {pending.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center mb-12">
          <p className="text-gray-500">No pending payouts.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-12">
          {pending.map((p) => (
            <div key={p.id} className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">{p.promoters?.display_name || "Unknown Promoter"}</h3>
                  <p className="text-sm text-gray-600">Requested {new Date(p.requested_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{"£" + Number(p.amount).toFixed(2)}</p>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4 text-sm">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Payout Details</p>
                {p.promoters?.payout_email && <p><strong>Email:</strong> {p.promoters.payout_email}</p>}
                {p.promoters?.payout_account_name && <p><strong>Account Name:</strong> {p.promoters.payout_account_name}</p>}
                {p.promoters?.payout_sort_code && <p><strong>Sort Code:</strong> {p.promoters.payout_sort_code}</p>}
                {p.promoters?.payout_account_number && <p><strong>Account:</strong> {p.promoters.payout_account_number}</p>}
                {!p.promoters?.payout_email && !p.promoters?.payout_account_number && (
                  <p className="text-red-600">No payout details on file.</p>
                )}
              </div>

              <Link
                href={"/admin/payouts/mark-paid?id=" + p.id}
                className="inline-block px-5 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800"
              >
                Mark as Paid
              </Link>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-antonio)" }}>PAID HISTORY</h2>

      {paid.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500">No paid payouts yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paid.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-5 border border-gray-200 rounded-lg">
              <div>
                <p className="font-bold">{p.promoters?.display_name || "Promoter"}</p>
                <p className="text-sm text-gray-500">
                  Paid {p.paid_at ? new Date(p.paid_at).toLocaleDateString("en-GB") : "—"}
                  {p.reference ? " · Ref: " + p.reference : ""}
                </p>
              </div>
              <p className="font-bold" style={{ fontFamily: "var(--font-antonio)" }}>{"£" + Number(p.amount).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/organizer" className="text-sm text-gray-500 hover:text-black">? Back to Dashboard</Link>
      </div>
    </div>
  );
}

