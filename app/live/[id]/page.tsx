import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { liveCategoryLabel } from "@/lib/live/catalog";
import { displayName } from "@/lib/live/server";
import LiveRoom from "./LiveRoom";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createServerSupabase();
  const { data: s } = await supabase
    .from("live_streams")
    .select("id, host_id, title, description, category, provider, provider_ref, status, scheduled_for, started_at, goal_coins, goal_label")
    .eq("id", id)
    .maybeSingle();
  return s ? { supabase, s } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await load((await params).id);
  if (!r) return { title: "GRID LIVE" };
  const { data: host } = await r.supabase.from("profiles").select("full_name, username").eq("id", r.s.host_id).maybeSingle();
  const title = `${r.s.status === "live" ? "LIVE: " : ""}${r.s.title} · ${displayName(host)}`;
  return { title: `${title} | GRID LIVE`, description: r.s.description ?? `${liveCategoryLabel(r.s.category)} on GRID LIVE. Watch, chat and send gifts.`, openGraph: { title, type: "video.other" } };
}

export default async function LivePage({ params }: Props) {
  const { id } = await params;
  const r = await load(id);
  if (!r) notFound();
  const { supabase, s } = r;
  const [{ data: host }, { data: products }, { data: auth }] = await Promise.all([
    supabase.from("profiles").select("full_name, username, avatar_url, headline").eq("id", s.host_id).maybeSingle(),
    supabase.from("live_products").select("id, kind, ref_id, url, title, price_pence, image_url, pinned, position").eq("stream_id", s.id).order("position"),
    supabase.auth.getUser(),
  ]);
  const user = auth.user;

  return (
    <LiveRoom
      stream={{
        id: s.id,
        title: s.title,
        description: s.description,
        category: s.category,
        provider: s.provider as "youtube" | "twitch",
        providerRef: s.provider_ref,
        status: s.status as "scheduled" | "live" | "ended",
        scheduledFor: s.scheduled_for,
        goalCoins: s.goal_coins,
        goalLabel: s.goal_label,
      }}
      host={{ name: displayName(host), username: host?.username ?? null, avatarUrl: host?.avatar_url ?? null, headline: host?.headline ?? null }}
      products={(products ?? []).map((p) => ({ id: p.id, kind: p.kind, refId: p.ref_id, url: p.url, title: p.title, pricePence: p.price_pence, imageUrl: p.image_url, pinned: p.pinned }))}
      viewer={{ signedIn: !!user, isHost: user?.id === s.host_id }}
    />
  );
}
