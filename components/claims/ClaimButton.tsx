'use client';

import { useState } from 'react';

export function ClaimButton({
  targetType,
  targetId,
  targetName,
}: {
  targetType: 'artist' | 'venue' | 'promoter' | 'festival' | 'label';
  targetId: string;
  targetName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClaim() {
    console.log('ClaimButton:', { targetType, targetId, targetName });
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          verification_method: 'email',
          notes: 'Claim submitted from profile page',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not submit claim');
      } else {
        setStatus(data.status);
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  if (status === 'pending') {
    return (
      <div style={{ padding: '12px 16px', borderRadius: 8, background: '#fef3c7', color: '#92400e', fontSize: 13, fontWeight: 600 }}>
        Claim pending review — an admin will verify your claim for {targetName}.
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div style={{ padding: '12px 16px', borderRadius: 8, background: '#f0fdf4', color: '#10b981', fontSize: 13, fontWeight: 600 }}>
        You own this profile.
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleClaim}
        disabled={loading}
        style={{ padding: '10px 20px', borderRadius: 8, background: '#111827', color: 'white', border: 'none', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? 'Submitting...' : 'Claim this profile'}
      </button>
      {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{error}</p>}
    </div>
  );
}