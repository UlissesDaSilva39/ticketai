"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Starts a draft, then opens the editor. Runs in the browser so link
// prefetching can never create empty drafts. ?newsletter=<id> starts an edition.
export default function NewArticlePage() {
  const router = useRouter();
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const newsletterId = new URLSearchParams(window.location.search).get("newsletter");
    fetch("/api/articles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ newsletterId }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
          return;
        }
        const d = await res.json().catch(() => ({}));
        if (!res.ok || !d.id) throw new Error(d.error || "Couldn't start an article.");
        router.replace(`/articles/${d.id}/edit`);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't start an article."));
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
      {error ? (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{error}</p>
          <Link href="/newsletters" className="inline-block mt-4 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
            Back to newsletters
          </Link>
        </div>
      ) : (
        <p className="text-gray-500" role="status">Opening the editor…</p>
      )}
    </div>
  );
}
