'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
export default function ArtistRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', username: '', city: '', genre: '', bio: '' });
  async function handleSubmit(e: any) {
    e.preventDefault(); setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');
    const cleanUsername = form.username.toLowerCase().replace(/[^a-z0-9]/g, '');
    await supabase.from('profiles').update({ full_name: form.fullName, username: cleanUsername, city: form.city, genre: form.genre, bio: form.bio, role: 'artist' }).eq('id', user.id);
    router.push('/artist/dashboard'); router.refresh();
  }
  return (
    <main style={{ minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <Link href='/'>Back to GRID</Link>
        <h1>Create your artist profile</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder='Artist Name' style={{ padding: '12px', border: '1px solid #ccc' }} />
          <input required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder='Username' style={{ padding: '12px', border: '1px solid #ccc' }} />
          <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder='City' style={{ padding: '12px', border: '1px solid #ccc' }} />
          <input required value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} placeholder='Genre' style={{ padding: '12px', border: '1px solid #ccc' }} />
          <textarea required value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder='Bio' style={{ padding: '12px', border: '1px solid #ccc' }} />
          <button type='submit' disabled={loading} style={{ padding: '14px', background: '#111', color: '#fff' }}>{loading ? '...' : 'Create'}</button>
        </form>
      </div>
    </main>
  );
}
