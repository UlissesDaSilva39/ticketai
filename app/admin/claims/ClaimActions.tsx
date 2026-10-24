'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ClaimActions({ claimId }: { claimId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function decide(status: 'approved' | 'rejected') {
    setLoading(true);
    try {
      const res = await fetch('/api/claims/' + claimId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => decide('approved')}
        disabled={loading}
        className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => decide('rejected')}
        disabled={loading}
        className="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}