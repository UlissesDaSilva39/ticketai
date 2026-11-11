 import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import FollowButton from "@/components/network/FollowButton";
import MessageButton from "@/components/MessageButton";

export const dynamic = "force-dynamic";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  genre: string | null;
  city: string | null;
  role: string | null;
};

const ROLE_LABELS: Record<string, string> = {
  artist: "Artist",
  dj: "DJ",
  producer: "Producer",
  band: "Band",
  manager: "Manager",
  promoter: "Promoter",
  venue: "Venue",
  a_and_r: "A&R",
  sound_engineer: "Sound Engineer",
  holder: "Holder",
  record_company: "Record Label",
  attendee: "Attendee",
  admin: "Admin",
  other: "Other",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, cover_url, bio, genre, city, role")
    .eq("username", id)
    .maybeSingle<Profile>();

  if (!profile) notFound();

  const name = profile.full_name || profile.username || "Someone";
  const initial = name.charAt(0).toUpperCase();
  const roleLabel = profile.role ? (ROLE_LABELS[profile.role] ?? profile.role) : null;

  return (
    <main style={{ background: "#ffffff", color: "#111111", minHeight: "100vh" }}>
      <div
        style={{
          height: "320px",
          backgroundImage: profile.cover_url
            ? `url(${profile.cover_url})`
            : "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginTop: "-48px", position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              border: "4px solid #ffffff",
              background: "#111111",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 700,
              overflow: "hidden",
            }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              initial
            )}
          </div>

          <h1 style={{ fontSize: "40px", fontWeight: 700, marginTop: "16px", marginBottom: "4px" }}>
            {name}
          </h1>

          <p style={{ fontSize: "14px", color: "#888888", marginBottom: "20px" }}>
            {profile.username ? `@${profile.username}` : null}
            {roleLabel ? ` · ${roleLabel}` : null}
            {profile.city ? ` · ${profile.city}` : null}
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <FollowButton targetId={profile.id} initiallyFollowing={false} />
            <MessageButton targetUserId={profile.id} />
          </div>
        </div>

        <div style={{ padding: "48px 0", borderBottom: "1px solid #e5e5e5" }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888888", marginBottom: "16px" }}>
            About
          </h2>
          <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#444444" }}>
            {profile.bio || "No bio yet."}
          </p>
        </div>

        <div style={{ padding: "48px 0", borderBottom: "1px solid #e5e5e5" }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888888", marginBottom: "16px" }}>
            Profile Song
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", border: "1px solid #e5e5e5", borderRadius: "10px", background: "#fafafa" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#111111", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>
              Play
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>Late Night Drive</p>
              <p style={{ fontSize: "12px", color: "#888888", margin: 0 }}>{name} · 3:42</p>
            </div>
          </div>
        </div>

        <div style={{ padding: "48px 0" }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888888", marginBottom: "16px" }}>
            Booking
          </h2>
          <p style={{ fontSize: "15px", color: "#444444", marginBottom: "20px" }}>
            Request for your next event. Escrow protected.
          </p>
          <Link
            href={`/book/artist/${profile.username}`}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: "999px",
              background: "#111111",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign up to book
          </Link>
        </div>
      </div>
    </main>
  );
}