"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FollowButton({
  targetId,
  initiallyFollowing,
}: {
  targetId: string;
  initiallyFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initiallyFollowing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async () => {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Log in to follow");
        return;
      }
      if (following) {
        const { error: delErr } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("target_id", targetId);
        if (delErr) throw delErr;
        setFollowing(false);
      } else {
        const { error: insErr } = await supabase
          .from("follows")
          .insert({ follower_id: user.id, target_id: targetId });
        if (insErr) throw insErr;
        setFollowing(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={
          "text-xs font-semibold rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 " +
          (following
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-black text-white hover:bg-gray-800")
        }
      >
        {busy ? "..." : following ? "Following" : "+ Follow"}
      </button>
      {error ? (
        <span className="text-[10px] text-red-600">{error}</span>
      ) : null}
    </div>
  );
}
