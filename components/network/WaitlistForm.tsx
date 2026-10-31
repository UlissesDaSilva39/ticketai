'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const ROLES = [
  { value: 'artist', label: 'Artist' },
  { value: 'dj', label: 'DJ' },
  { value: 'producer', label: 'Producer' },
  { value: 'band', label: 'Band' },
  { value: 'manager', label: 'Manager' },
  { value: 'promoter', label: 'Promoter' },
  { value: 'venue', label: 'Venue' },
  { value: 'a_and_r', label: 'A&R' },
  { value: 'sound_engineer', label: 'Sound Engineer' },
  { value: 'holder', label: 'Holder' },
  { value: 'other', label: 'Other' },
];

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('artist');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    const supabase = createClient();

    const { error } = await supabase
      .from('network_waitlist')
      .insert({
        email: email.trim().toLowerCase(),
        role: role,
      });

    if (error) {
      if (error.code === '23505') {
        setStatus('success');
        setMessage('You are already on the list. We will be in touch.');
      } else {
        setStatus('error');
        setMessage(error.message);
      }
      return;
    }

    setStatus('success');
    setMessage('You are on the list. We will open the Network in batches.');
    setEmail('');
  }

  if (status === 'success') {
    return (
      <div style={{
        padding: '24px',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        background: '#fafafa',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '18px', fontWeight: 600, color: '#111', marginBottom: '8px' }}>
          You are in the queue
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '520px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === 'loading'}
          style={{
            padding: '14px 18px',
            border: '1px solid #cccccc',
            borderRadius: '999px',
            fontSize: '15px',
            outline: 'none',
          }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={status === 'loading'}
          style={{
            padding: '14px 18px',
            border: '1px solid #cccccc',
            borderRadius: '999px',
            fontSize: '15px',
            outline: 'none',
            background: '#ffffff',
            color: '#111111',
            cursor: 'pointer',
          }}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            padding: '14px 28px',
            borderRadius: '999px',
            border: 'none',
            background: '#111111',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
        </button>
      </div>
      {status === 'error' && (
        <p style={{ fontSize: '13px', color: '#c00', marginTop: '8px' }}>{message}</p>
      )}
      <p style={{ fontSize: '13px', color: '#888', marginTop: '12px' }}>
        Free to join. No card needed. We open access in batches.
      </p>
    </form>
  );
}
