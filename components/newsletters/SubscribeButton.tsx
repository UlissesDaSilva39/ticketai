"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscribeButton({
  newsletterId,
  initialSubscribed,
  initialCount,
  signedIn,
  isOwner,
  loginRedirect,
  size = "md",
}: {
  newsletterId: string;
  initialSubscribed: boolean;
  initialCount: number;
  signedIn: boolean;
  isOwner: boolean;
  loginRedirect: string;
  size?: "md" | "sm";
}) {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pad = size === "sm" ? "px-4 py-1.5 text-sm" : "px-6 py-2.5";
  const label = `${count.toLocaleString("en-GB")} subscriber${count === 1 ? "" : "s"}`;

  if (isOwner) return <span className="text-sm text-gray-500">{label}</span>;

  async function toggle() {
    if (!signedIn) {
      router.push(`/login?redirect=${encodeURIComponent(loginRedirect)}`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/newsletters/${newsletterId}/subscribe`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subscribe: !subscribed }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Something went wrong.");
      setSubscribed(d.subscribed);
      setCount(d.subscribers);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={subscribed}
        className={`${pad} rounded-full font-bold transition-colors disabled:opacity-60 ${
          subscribed
            ? "border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:border-red-400 hover:text-red-600"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }`}
      >
        {subscribed ? "✓ Subscribed" : "Subscribe"}
      </button>
      <span className="text-sm text-gray-500">{label}</span>
      {error && <span role="alert" className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
