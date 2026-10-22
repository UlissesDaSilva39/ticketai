'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ClubSuccessPage() {
  const params = useSearchParams();
  const sessionId = params?.get('session_id');
  const tier = params?.get('tier');
  const entity = params?.get('entity');
  const isDev = params?.get('dev') === '1';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (isDev) {
      setStatus('success');
      return;
    }
    if (!sessionId) {
      setStatus('error');
      return;
    }
    // Verify the Stripe session
    fetch(`/api/clubs/verify-session?session_id=${sessionId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setStatus(d?.verified ? 'success' : 'error'))
      .catch(() => setStatus('error'));
  }, [sessionId, isDev]);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 500, width: '100%', background: '#fff', padding: 48, borderRadius: 24, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h1 style={{ fontSize: 24, fontWeight: 900 }}>Confirming your membership...</h1>
            <p style={{ color: '#6b7280' }}>Please wait while we verify your payment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width: 80, height: 80, margin: '0 auto 24px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>You're in! 🎉</h1>
            <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              Welcome to {entity ? entity.replace(/-/g, ' ') : 'the club'}
              {tier && <> — <strong>{tier}</strong> tier</>}.
              <br />
              Your membership is active. Check your email for your member card and perks.
            </p>
            <Link href="/settings/subscriptions" style={{ display: 'block', padding: '14px 32px', background: '#111827', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, marginBottom: 12 }}>
              View My Memberships
            </Link>
            <Link href="/discover/events" style={{ display: 'block', padding: '14px 32px', background: '#fff', color: '#111827', border: '1px solid #d1d5db', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>
              Browse Events
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: '#6b7280', marginBottom: 32 }}>We couldn't confirm your membership. Please contact support or try again.</p>
            <Link href="/discover/events" style={{ display: 'inline-block', padding: '14px 32px', background: '#111827', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>
              Back to Events
            </Link>
          </>
        )}
      </div>
    </div>
  );
}