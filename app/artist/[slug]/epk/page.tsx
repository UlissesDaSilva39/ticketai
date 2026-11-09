"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StartRemixButton } from "@/components/StartRemixButton";

type Req = { id: string; remixer_name: string; status: string };

export default function ArtistEpkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [requests, setRequests] = useState<Req[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/remix/request?artist=" + encodeURIComponent(slug));
        if (r.ok) {
          const j = await r.json();
          setRequests(j.requests ?? []);
        }
      } catch {}
    })();
  }, [slug]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
        Electronic Press Kit
      </p>
      <h1 className="text-4xl font-bold mb-6">
        {slug.replace(/-/g, " ")}
      </h1>

      <div className="flex gap-3 mb-8">
        <StartRemixButton artistSlug={slug} />
        <button onClick={() => router.push("/messages")}
          className="rounded-full border px-5 py-3 text-sm">
          Message this artist
        </button>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Bio</h2>
        <p className="text-gray-600">Artist bio from profile.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Remix activity</h2>
        {requests.length === 0 ? (
          <p className="text-sm text-gray-500">
            No remixes yet. Be the first — click "Start Remix".
          </p>
        ) : (
          <ul className="space-y-2">
            {requests.map((r) => (
              <li key={r.id} className="rounded-xl border p-3 text-sm">
                {r.remixer_name} — {r.status}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}