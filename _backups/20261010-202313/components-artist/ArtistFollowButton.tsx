"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const toggle = async () => {
    if (!signedIn) {
      router.push(`/login?next=/artist/${artistSlug}`);
      return;
    }

    setBusy(true);
    const action = following ? "unfollow" : "follow";
    try {
      const res = await fetch(`/api/artists/${artistSlug}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (json.ok) {
        setFollowing(json.following);
        setCount(json.count);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={"px-5 py-2.5 text-sm font-medium rounded-full transition disabled:opacity-60 " + (following ? "border border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-black text-white hover:bg-gray-800")}
    >
      {following ? "Following · " + count : "+ Follow · " + count}
    </button>
  );
}
