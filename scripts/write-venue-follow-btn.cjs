const fs = require("fs");
const path = require("path");

const dir = "components/venue";
fs.mkdirSync(dir, { recursive: true });

const content = `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, UserCheck } from "lucide-react";

type Props = {
  venueSlug: string;
  initialFollowing: boolean;
  initialCount: number;
  signedIn: boolean;
};

export default function VenueFollowButton({
  venueSlug,
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
      router.push("/login?next=/venue/" + venueSlug);
      return;
    }

    setBusy(true);
    const next = !following;
    setFollowing(next);
    setCount((n) => Math.max(n + (next ? 1 : -1), 0));

    try {
      const res = await fetch("/api/venues/" + venueSlug + "/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following: next }),
      });

      if (!res.ok) {
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
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={following}
      aria-label={
        following
          ? "Unfollow, " + count + " followers"
          : "Follow, " + count + " followers"
      }
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
`;

fs.writeFileSync(path.join(dir, "VenueFollowButton.tsx"), content, "utf8");
console.log("✅ " + path.join(dir, "VenueFollowButton.tsx") + " (" + content.split("\n").length + " lines)");
