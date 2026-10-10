"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { UserPlus, UserCheck } from "lucide-react";

type Props = {
  artistSlug: string;
  initialFollowing: boolean;
  initialCount: number;
  signedIn: boolean;
};

export default function ArtistFollowButton({
  artistSlug,
  initialFollowing,
  initialCount,
  signedIn,
}: Props) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!signedIn) {
      router.push(`/login?next=/artist/${artistSlug}`);
      return;
    }

    setBusy(true);
    const next = !following;
    setFollowing(next);
    setCount((n) => Math.max(n + (next ? 1 : -1), 0));

    try {
      const res = await fetch(`/api/artists/${artistSlug}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following: next }),
      });

      if (!res.ok) {
        // Roll back on failure
        setFollowing(!next);
        setCount((n) => Math.max(n + (next ? -1 : 1), 0));
      }
    } catch {
      setFollowing(!next);
      setCount((n) => Math.max(n + (next ? -1 : 1), 0));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={
        "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition disabled:opacity-50 " +
        (following
          ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
          : "bg-black text-white hover:bg-gray-800")
      }
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" />
          Following · {count}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow · {count}
        </>
      )}
    </button>
  );
}
