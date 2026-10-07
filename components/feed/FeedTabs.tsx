"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FeedTabs() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("tab") === "following" ? "following" : "for-you";

  const go = (tab: "for-you" | "following") => {
    if (tab === "for-you") router.push("/");
    else router.push("/?tab=following");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-1 flex gap-1">
      <button
        onClick={() => go("for-you")}
        className={
          "flex-1 py-2 text-sm font-medium rounded-xl transition " +
          (current === "for-you" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100")
        }
      >
        For You
      </button>
      <button
        onClick={() => go("following")}
        className={
          "flex-1 py-2 text-sm font-medium rounded-xl transition " +
          (current === "following" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100")
        }
      >
        Following
      </button>
    </div>
  );
}
