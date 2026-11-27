import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import GoLiveForm from "./GoLiveForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Go live | GRID LIVE" };

export default async function GoLivePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent("/live/new")}`);

  // The host's own products they can pin during the live.
  const [{ data: market }, { data: licences }] = await Promise.all([
    supabase.from("marketplace_listings").select("id, title, price_pence, kind").eq("seller_id", user.id).eq("status", "active").order("created_at", { ascending: false }).limit(30),
    supabase.from("licence_listings").select("id, track_title, price_creator, price_commercial, price_sync").eq("owner_id", user.id).eq("status", "active").order("created_at", { ascending: false }).limit(30),
  ]);

  return (
    <GoLiveForm
      listings={[
        ...(market ?? []).map((m) => ({ kind: "marketplace" as const, id: m.id, title: m.title, sub: m.kind.replace("_", " "), pence: m.price_pence })),
        ...(licences ?? []).map((l) => ({
          kind: "licence" as const,
          id: l.id,
          title: `Licence "${l.track_title}"`,
          sub: "licence",
          pence: Math.min(...[l.price_creator, l.price_commercial, l.price_sync].filter((x): x is number => x != null)),
        })),
      ]}
    />
  );
}
