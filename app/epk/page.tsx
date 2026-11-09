"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StartRemixButton } from "@/components/StartRemixButton";
import { Play, Music, FileText, ArrowLeft, Upload, Edit3 } from "lucide-react";

type Req = {
  id: string;
  remixer_name: string;
  status: string;
  proposed_split: { original_pct: number; remixer_pct: number; platform_pct: number };
  created_at: string;
};

export default function EpkPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/remix/request?mine=1");
        if (r.ok) {
          const j = await r.json();
          setRequests(j.requests ?? []);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-gray-200 pb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest mb-6 border border-gray-200">
              <FileText className="w-3.5 h-3.5" /> Artist Press Kit
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-black mb-4">
              Your EPK
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Electronic Press Kit + collaboration history. Everything here is visible to promoters and remixers who want to work with you.
            </p>
          </div>
          <div className="shrink-0">
            <StartRemixButton artistSlug="your-slug-here" />
          </div>
        </div>

        {/* Collaborations Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-black">Collaborations</h2>
            <span className="text-sm font-medium text-gray-500">{requests.length} total</span>
          </div>

          {loading && (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-3 py-1">
                <div className="h-20 bg-gray-100 rounded-2xl w-full"></div>
              </div>
            </div>
          )}

          {!loading && requests.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
              <p className="text-gray-500 text-sm">
                No remix proposals yet. When someone clicks <strong className="text-black">Start Remix</strong> on your profile, their request will appear here with the exact split numbers.
              </p>
            </div>
          )}

          <ul className="space-y-4">
            {requests.map((r) => (
              <li key={r.id} className="group rounded-2xl border border-gray-200 bg-white p-6 flex items-center justify-between hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-black flex items-center justify-center border border-gray-200">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-black text-lg">{r.remixer_name}</p>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      Split: <span className="text-black">{r.proposed_split.original_pct}% you</span> / <span className="text-black">{r.proposed_split.remixer_pct}% them</span> / {r.proposed_split.platform_pct}% platform
                    </p>
                  </div>
                </div>
                <span className={`text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full border ${
                  r.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' : 
                  r.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                  'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Bio Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-black">Bio</h2>
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8">
            <p className="text-gray-500 leading-relaxed">
              Your artist bio will appear here. Promoters use this section to understand your background, genre, and past achievements before reaching out.
            </p>
          </div>
        </section>

        {/* Latest Tracks Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-black">Latest Tracks</h2>
            <button onClick={() => router.push("/upload/track")} className="text-sm font-semibold text-black hover:underline">
              Upload New
            </button>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8">
            <p className="text-gray-500 leading-relaxed">
              Your published tracks load automatically here, with play counts and direct links for promoters to stream.
            </p>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-200 pt-10">
          <button 
            onClick={() => router.push("/messages")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-4 text-sm font-bold text-black hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to messages
          </button>
          <button 
            onClick={() => router.push("/upload/track")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-black text-white px-8 py-4 text-sm font-bold hover:bg-gray-900 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload a track
          </button>
        </div>

      </div>
    </main>
  );
}