import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { LICENCE_INFO, formatGbp, isLicenceType } from "@/lib/licensing/agreement";
import ConfirmPayment from "./ConfirmPayment";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; cls: string }> = {
  active: { label: "Active", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  pending: { label: "Awaiting payment", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  cancelled: { label: "Cancelled", cls: "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-300" },
  refunded: { label: "Refunded: licence ended", cls: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
  revoked: { label: "Payment disputed: licence suspended", cls: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
};

export default async function LicencePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent(`/licences/${id}`)}`);

  // RLS: only the licensee and the licensor can read the deal.
  const { data: deal } = await supabase
    .from("licence_deals")
    .select("id, listing_id, buyer_id, seller_id, licence_type, project_title, buyer_legal_name, amount_pence, fee_pence, total_pence, agreement_version, agreement_text, agreement_sha256, accepted_at, status, paid_at")
    .eq("id", id)
    .maybeSingle();
  if (!deal) notFound();

  const { data: listing } = await supabase.from("licence_listings").select("track_title, artist_name").eq("id", deal.listing_id).maybeSingle();
  const isBuyer = deal.buyer_id === user.id;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : null;
  const status = STATUS[deal.status] ?? STATUS.pending;
  const typeName = isLicenceType(deal.licence_type) ? LICENCE_INFO[deal.licence_type].name : "Licence";
  const ref = `GRID-L-${deal.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        <Link href="/licensing?tab=mine" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block print:hidden">
          ← My licences
        </Link>

        {deal.status === "pending" && isBuyer && sessionId && <ConfirmPayment sessionId={sessionId} />}

        <article className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-8 print:border-0 print:p-0">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">{typeName}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{listing?.track_title ?? "Track"}</h1>
              <p className="text-gray-600 dark:text-gray-400">{listing?.artist_name}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.cls}`}>{status.label}</span>
          </div>

          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm mb-6">
            {[
              ["Licence number", ref],
              ["Project", deal.project_title],
              ["Licensee (signed by)", deal.buyer_legal_name],
              ["Signed", new Date(deal.accepted_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" }) + " UTC"],
              [isBuyer ? "You paid" : "You earn", isBuyer ? formatGbp(deal.total_pence) : formatGbp(deal.amount_pence)],
              ["Agreement", deal.agreement_version],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-semibold text-gray-900 dark:text-white break-words">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-3 mb-8 print:hidden">
            {deal.status === "active" && (
              <a
                href={`/api/licensing/download/${deal.id}`}
                className="px-5 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Download track
              </a>
            )}
            <PrintButton />
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Signed agreement</h2>
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 p-4 sm:p-6 text-[13px] leading-relaxed text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-[ui-serif,Georgia,serif] print:border-0 print:bg-white print:p-0">
            {deal.agreement_text}
          </div>
          <p className="mt-4 text-[11px] text-gray-500 break-all">
            Accepted electronically by {deal.buyer_legal_name}. Fingerprint (SHA-256) of the agreement text: {deal.agreement_sha256}
          </p>
          {!isBuyer && (
            <p className="mt-2 text-[11px] text-gray-500">
              Licence fee {formatGbp(deal.amount_pence)} is added to your seller balance once paid, and can be withdrawn after the 7-day hold.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
