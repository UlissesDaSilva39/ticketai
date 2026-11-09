"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StartRemixButton } from "@/components/StartRemixButton";
import { Play, Music, FileText, ArrowLeft, Upload, Edit3, TrendingUp, DollarSign } from "lucide-react";

type Req = {
  id: string;
  remixer_name: string;
  status: string;
  proposed_split: { original_pct: number; remixer_pct: number; platform_pct: number };
  created_at: string;
};

type Ledger = {
  total_earned_cents: number;
  transactions: any[];
};

export default function EpkPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<Req[]>([]);
  const [ledger, setLedger] = useState<Ledger | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [reqRes, ledgerRes] = await Promise.all([
          fetch("/api/remix/request?mine=1"),
          fetch("/api/epk/ledger")
        ]);
        
        if (reqRes.ok) {
          const j = await reqRes.json();
          setRequests(j.requests ?? []);
        }
        if (ledgerRes.ok) {
          const j = await ledgerRes.json();
          setLedger(j);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-gray-200 pb-10">
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

        {/* Revenue Dashboard (New) */}
        {ledger && (ledger.total_earned_cents > 0 || ledger.transactions.length > 0) && (
          <section className="mb-16">
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-1">Your Earnings</p>
                  <div className="text-4xl font-black text-emerald-900 flex items-baseline gap-2">
                    ${(ledger.total_earned_cents / 100).toFixed(2)}
                    <span className="text-sm font-medium text-emerald-700">total</span>
                  </div>
                </div>
              </div>
              
              {ledger.transactions.length > 0 && (
                <div className="flex-1 max-w-md w-full bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recent Transactions</p>
                  <ul className="space-y-3">
                    {ledger.transactions.slice(0,3).map((t, i) => (
                      <li key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="capitalize text-gray-600">{t.source}</span>
                          <span className="text-xs text-gray-400">({t.role})</span>
                        </div>
                        <span className="font-bold text-black">+${(t.my_cut_cents / 100).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

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
              <li key={r.id} onClick={() => router.push(`/remix/${r.id}`)} className="cursor-pointer group rounded-2xl border border-gray-200 bg-white p-6 flex items-center justify-between hover:border-gray-400 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-black flex items-center justify-center border border-gray-200 group-hover:bg-gray-200 transition-colors">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-black text-lg flex items-center gap-2">
                      {r.remixer_name}
                      {r.status === 'released' && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600" title="Verified Collaboration">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      Split: <span className="text-black">{r.proposed_split.original_pct}% you</span> / <span className="text-black">{r.proposed_split.remixer_pct}% them</span> / {r.proposed_split.platform_pct}% platform
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full border ${
                    r.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' : 
                    r.status === 'released' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    r.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {r.status}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-black transition-colors">Manage →</span>
                </div>
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