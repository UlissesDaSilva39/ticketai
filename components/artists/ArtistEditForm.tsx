'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Artist = {
  id: string;
  slug: string;
  name: string | null;
  handle: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  genre: string | null;
  artist_type: string | null;
  website: string | null;
  spotify: string | null;
  instagram: string | null;
  avatar_url: string | null;
};

export function ArtistEditForm({ artist }: { artist: Artist }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: artist.name ?? '',
    handle: artist.handle ?? '',
    bio: artist.bio ?? '',
    city: artist.city ?? '',
    country: artist.country ?? '',
    genre: artist.genre ?? '',
    artist_type: artist.artist_type ?? '',
    website: artist.website ?? '',
    spotify: artist.spotify ?? '',
    instagram: artist.instagram ?? '',
    avatar_url: artist.avatar_url ?? '',
  });

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch('/api/artists/' + artist.slug + '/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not save');
      } else {
        setSaved(true);
        router.refresh();
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  const field = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' as const };
  const label = { display: 'block', fontSize: 12, fontWeight: 700 as const, color: '#374151', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      <label style={label}>Name</label>
      <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} style={field} />

      <label style={label}>Handle</label>
      <input type="text" value={form.handle} onChange={(e) => update('handle', e.target.value)} style={field} placeholder="djpoxy" />

      <label style={label}>Artist type</label>
      <select value={form.artist_type} onChange={(e) => update('artist_type', e.target.value)} style={field}>
        <option value="">Select</option>
        <option value="DJ">DJ</option>
        <option value="Producer">Producer</option>
        <option value="Singer">Singer</option>
        <option value="Band">Band</option>
        <option value="Group">Group</option>
      </select>

      <label style={label}>Genre</label>
      <input type="text" value={form.genre} onChange={(e) => update('genre', e.target.value)} style={field} placeholder="House" />

      <label style={label}>City</label>
      <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} style={field} placeholder="London" />

      <label style={label}>Country</label>
      <input type="text" value={form.country} onChange={(e) => update('country', e.target.value)} style={field} placeholder="United Kingdom" />

      <label style={label}>Bio</label>
      <textarea value={form.bio} onChange={(e) => update('bio', e.target.value)} rows={4} style={{ ...field, resize: 'vertical' as const, fontFamily: 'inherit' }} />

      <label style={label}>Website</label>
      <input type="url" value={form.website} onChange={(e) => update('website', e.target.value)} style={field} placeholder="https://" />

      <label style={label}>Spotify</label>
      <input type="url" value={form.spotify} onChange={(e) => update('spotify', e.target.value)} style={field} placeholder="https://open.spotify.com/artist/..." />

      <label style={label}>Instagram</label>
      <input type="text" value={form.instagram} onChange={(e) => update('instagram', e.target.value)} style={field} placeholder="djpoxy" />

      <label style={label}>Avatar URL</label>
      <input type="url" value={form.avatar_url} onChange={(e) => update('avatar_url', e.target.value)} style={field} placeholder="https://" />

      {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      {saved && <p style={{ color: '#10b981', fontSize: 13, marginBottom: 12 }}>Your public profile is updated.</p>}

      <button type="submit" disabled={loading} style={{ padding: '12px 24px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}