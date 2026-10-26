'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export function DemoModal() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), 30000);
    return () => clearTimeout(timer);
  }, [dismissed]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 text-white text-2xl mb-4">*</div>
          <h3 className="text-2xl font-bold mb-2">Ready to start?</h3>
          <p className="text-gray-600 text-sm">You've seen what GRID can do. Create your free profile in 2 minutes. No card needed.</p>
        </div>
        <div className="space-y-3">
          <Link href="/signup" className="block w-full rounded-full bg-black text-white text-center py-3 font-semibold hover:bg-neutral-800">Create free account</Link>
          <button onClick={() => { setOpen(false); setDismissed(true); }} className="block w-full text-center text-gray-500 text-sm hover:text-gray-700 py-2">Keep exploring</button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Free forever. No card. Cancel anytime.</p>
      </div>
    </div>
  );
}
