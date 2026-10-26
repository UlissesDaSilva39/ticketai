'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export function DemoBanner({ page }: { page: string }) {
  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem('grid_demo_last_page', page);
      localStorage.setItem('grid_demo_visited_at', new Date().toISOString());
    } catch {}
    setShown(true);
  }, [page]);
  if (!shown || dismissed) return null;
  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-violet-600 to-pink-500 text-white">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">DEMO</span>
          <p className="text-sm font-medium">You're exploring a live demo. Sign up free to book, buy, and save.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/signup" className="rounded-full bg-white text-violet-700 px-4 py-2 text-sm font-semibold hover:bg-gray-100">Sign up free</Link>
          <button onClick={() => setDismissed(true)} className="text-white/70 hover:text-white text-sm">X</button>
        </div>
      </div>
    </div>
  );
}
