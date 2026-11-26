"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Creates a draft release, then opens it in the editor. Runs in the browser on
// purpose so link prefetching can never create empty drafts.
export default function NewReleasePage() {
  const router = useRouter();
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    fetch("/api/distribution/releases", { method: "POST" })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace(`/login?redirect=${encodeURIComponent("/distribution/releases/new")}`);
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.id) throw new Error(data.error || "Could not start a release.");
        router.replace(`/distribution/releases/${data.id}`);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not start a release."));
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      {error ? (
        <div className="text-center">
          <p className="text-gray-900 dark:text-white font-semibold">{error}</p>
          <Link href="/distribution/releases" className="inline-block mt-4 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
            Back to my releases
          </Link>
        </div>
      ) : (
        <p className="text-gray-500" role="status">
          Starting your release…
        </p>
      )}
    </div>
  );
}
