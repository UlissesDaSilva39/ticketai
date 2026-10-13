const fs = require("fs");
const path = require("path");

function write(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("  ✅ " + rel + " (" + content.split("\n").length + " lines)");
}

// ---------- toggle/route.ts ----------
write("app/api/follows/toggle/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { targetType?: string; targetId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { targetType, targetId } = body;
  if (!targetType || !targetId) {
    return NextResponse.json({ error: "targetType and targetId required" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();

  let nowFollowing: boolean;
  if (existing) {
    const { error } = await supabase.from("follows").delete().eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    nowFollowing = false;
  } else {
    const { error } = await supabase.from("follows").insert({
      follower_id: user.id,
      target_type: targetType,
      target_id: targetId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    nowFollowing = true;
  }

  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  return NextResponse.json({ following: nowFollowing, count: count ?? 0 });
}
`);

// ---------- status/route.ts ----------
write("app/api/follows/status/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const url = new URL(req.url);
  const targetType = url.searchParams.get("targetType");
  const targetId = url.searchParams.get("targetId");

  if (!targetType || !targetId) {
    return NextResponse.json({ error: "targetType and targetId required" }, { status: 400 });
  }

  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  const { data: { user } } = await supabase.auth.getUser();

  let following = false;
  if (user) {
    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .maybeSingle();
    following = Boolean(data);
  }

  return NextResponse.json({ following, count: count ?? 0 });
}
`);

// ---------- FollowButton.tsx ----------
write("components/social/FollowButton.tsx", `"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  targetType: "artist" | "venue" | "promoter" | "organizer";
  targetId: string;
  followLabel?: string;
  followingLabel?: string;
  className?: string;
  size?: "sm" | "md";
};

export default function FollowButton({
  targetType,
  targetId,
  followLabel = "Follow",
  followingLabel = "Following",
  className = "",
  size = "md",
}: Props) {
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/follows/status?targetType=" + targetType + "&targetId=" + targetId)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setFollowing(Boolean(d.following));
        setCount(Number(d.count) || 0);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [targetType, targetId]);

  async function toggle() {
    const optimistic = !following;
    setFollowing(optimistic);
    setCount((c) => c + (optimistic ? 1 : -1));

    const res = await fetch("/api/follows/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId }),
    });

    if (res.status === 401) {
      router.push("/login?next=" + encodeURIComponent(window.location.pathname));
      return;
    }
    if (!res.ok) {
      setFollowing(!optimistic);
      setCount((c) => c + (optimistic ? -1 : 1));
      return;
    }
    const data = await res.json();
    setFollowing(Boolean(data.following));
    setCount(Number(data.count) || 0);
    startTransition(() => router.refresh());
  }

  const text = loading ? "..." : following ? followingLabel : followLabel;
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading || isPending}
      aria-pressed={following}
      aria-label={following ? "Unfollow, " + count + " followers" : "Follow, " + count + " followers"}
      className={"inline-flex items-center gap-2 rounded-full font-medium transition " + pad + " " + (following ? "bg-neutral-200 text-neutral-800 hover:bg-neutral-300" : "bg-black text-white hover:bg-neutral-800") + " disabled:opacity-50 " + className}
    >
      <span>{text}</span>
      {!loading && (
        <span className="text-xs opacity-70 tabular-nums">{count}</span>
      )}
    </button>
  );
}
`);

console.log("");
console.log("All 3 files written cleanly.");
