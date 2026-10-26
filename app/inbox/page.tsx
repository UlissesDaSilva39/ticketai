import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import InboxList from "@/components/inbox/InboxList";
import type { InboxMessage } from "@/components/inbox/MessageRow";

export const metadata: Metadata = {
  title: "Inbox",
  description: "Messages sent to your artist, promoter, or user profiles.",
};

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/inbox");

  const out: InboxMessage[] = [];

  // artist messages
  const { data: myArtists } = await supabase
    .from("artists").select("slug, name").eq("owner_id", user.id);
  const slugs = (myArtists ?? []).map((a) => a.slug);
  if (slugs.length > 0) {
    const { data } = await supabase
      .from("artist_messages")
      .select("id, artist_slug, name, email, message, read_at, created_at")
      .in("artist_slug", slugs)
      .order("created_at", { ascending: false })
      .limit(200);
    const byslug = new Map((myArtists ?? []).map((a) => [a.slug, a.name]));
    for (const m of data ?? []) {
      out.push({
        id: m.id, source: "artist",
        sender_name: m.name, sender_email: m.email, message: m.message,
        read_at: m.read_at, created_at: m.created_at,
        context: byslug.get(m.artist_slug) ?? null,
      });
    }
  }

  // promoter messages
  const { data: myProms } = await supabase
    .from("promoters").select("id, display_name").eq("user_id", user.id);
  const pids = (myProms ?? []).map((p) => p.id);
  if (pids.length > 0) {
    const { data } = await supabase
      .from("promoter_messages")
      .select("id, promoter_id, name, email, message, read_at, created_at")
      .in("promoter_id", pids)
      .order("created_at", { ascending: false })
      .limit(200);
    const byId = new Map((myProms ?? []).map((p) => [p.id, p.display_name]));
    for (const m of data ?? []) {
      out.push({
        id: m.id, source: "promoter",
        sender_name: m.name, sender_email: m.email, message: m.message,
        read_at: m.read_at, created_at: m.created_at,
        context: byId.get(m.promoter_id) ?? null,
      });
    }
  }

  // direct messages
  const { data: directs } = await supabase
    .from("user_messages")
    .select("id, sender_name, sender_email, message, read_at, created_at")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);
  for (const m of directs ?? []) {
    out.push({
      id: m.id, source: "direct",
      sender_name: m.sender_name, sender_email: m.sender_email, message: m.message,
      read_at: m.read_at, created_at: m.created_at, context: null,
    });
  }

  out.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const counts = {
    all: out.length,
    unread: out.filter((m) => !m.read_at).length,
    artist: out.filter((m) => m.source === "artist").length,
    promoter: out.filter((m) => m.source === "promoter").length,
    direct: out.filter((m) => m.source === "direct").length,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
            <p className="mt-1 text-gray-500">
              Messages sent to your artist, promoter, and user profiles.
            </p>
          </div>
          {counts.unread > 0 && (
            <span className="rounded-full bg-black text-white text-xs font-semibold px-3 py-1">
              {counts.unread} unread
            </span>
          )}
        </div>

        <InboxList messages={out} counts={counts} />
      </div>
    </div>
  );
}