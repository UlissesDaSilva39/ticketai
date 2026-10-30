'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function MessageButton({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleMessage() {
    setLoading(true);
    const supabase = createClient();

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.id === targetUserId) {
      alert('You cannot message yourself.');
      setLoading(false);
      return;
    }

    const [a, b] = [user.id, targetUserId].sort();

    const { data: existing } = await supabase
      .from('threads')
      .select('id')
      .eq('participant_a', a)
      .eq('participant_b', b)
      .maybeSingle();

    if (existing) {
      router.push(`/messages/${existing.id}`);
      return;
    }

    const { data: created, error } = await supabase
      .from('threads')
      .insert({ participant_a: a, participant_b: b })
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') {
        const { data: fallback } = await supabase
          .from('threads')
          .select('id')
          .eq('participant_a', a)
          .eq('participant_b', b)
          .single();
        if (fallback) {
          router.push(`/messages/${fallback.id}`);
          return;
        }
      }
      alert('Could not create thread: ' + error.message);
      setLoading(false);
      return;
    }

    router.push(`/messages/${created.id}`);
  }

  return (
    <button
      type="button"
      onClick={handleMessage}
      disabled={loading}
      style={{
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid #cccccc',
        background: '#ffffff',
        color: '#111111',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '13px',
      }}
    >
      {loading ? '...' : 'Message'}
    </button>
  );
}
