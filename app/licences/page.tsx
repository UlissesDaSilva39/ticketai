import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { LICENCE_INFO, formatGbp, isLicenceType } from "@/lib/licensing/agreement";

export const dynamic = "force-dynamic";
export const metadata = { title: "My licences | GRID" };

type Row = {
  id: string;
  listing_id: string;
  buyer_id: string;
  licence_type: string;
  project_title: string;
  amount_pence: number;
  total_pence: number;
  status: string;
  created_at: string;
};

export default async function MyLicencesPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent("/licences")}`);

  // RLS returns only deals where this member is the licensee or the licensor.
  const { data } = await supabase
    .from("licence_deals")
    .select("id, listing_id, buyer_id, licence_type, project_title, amount_pence, total_pence, status, created_at")
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })
    .limit(200);
  const deals = (data ?? []) as Row[];

  const listingIds = [...new Set(deals.map((d) => d.listing_id))];
  const { data: listings } = listingIds.length
    ? await supabase.from("licence_listings").select("id, track_title, artist_name").in("id", listingIds)
    : { data: [] as { id: string; track_title: string; artist_name: string }[] };
  const byId = new Map((listings ?? []).map((l) => [l.id, l]));

  const bought = deals.filter((d) => d.buyer_id === user.id);
  const sold = deals.filter((d) => d.buyer_id !== user.id);

  const List = ({ rows, mine }: { rows: Row[]; mine: boolean }) =>
    rows.length === 0 ? (
      <p className="text-sm text-gray-500 py-6">{mine ? "You haven't licensed any music yet." : "No one has licensed your music yet."}</p>
    ) : (
      <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
        {rows.map((d) => {
          const l = byId.get(d.listing_id);
          return (
            <li key={d.id}>
              <Link href={`/licences/${d.id}`} className="flex items-center justify-between gap-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 -mx-2 px-2 rounded-lg">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {l?.track_title ?? "Track"} <span className="font-normal text-gray-500">· {l?.artist_name}</span>
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {isLicenceType(d.licence_type) ? LICENCE_INFO[d.licence_type].name : "Licence"} · {d.project_title} ·{" "}
                    {new Date(d.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="text-right flex-none">
                  <p className="font-semibold text-gray-900 dark:text-white">{formatGbp(mine ? d.total_pence : d.amount_pence)}</p>
                  <p className={`text-xs ${d.status === "active" ? "text-emerald-600" : "text-gray-500"}`}>{d.status === "pending" ? "awaiting payment" : d.status}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My licences</h1>
            <p className="text-gray-600 dark:text-gray-400">Signed agreements for music you licensed, and licences you issued.</p>
          </div>
          <Link href="/licensing/new" className="px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 text-sm">
            + List a track
          </Link>
        </div>
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Music I licensed</h2>
          <List rows={bought} mine />
        </section>
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Licences I issued</h2>
          <List rows={sold} mine={false} />
          {sold.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              Earnings go to your <Link href="/seller" className="underline">seller balance</Link>.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
