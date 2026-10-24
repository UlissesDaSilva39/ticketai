'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Promoter = {
  id: string;
  display_name: string | null;
  bio: string | null;
  city: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  commission_rate: number | null;
};

export function PromoterEditForm({ promoter }: { promoter: Promoter }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    display_name: promoter.display_name ?? '',
    bio: promoter.bio ?? '',
    city: promoter.city ?? '',
    instagram: promoter.instagram ?? '',
    tiktok: promoter.tiktok ?? '',
    youtube: promoter.youtube ?? '',
    commission_rate: promoter.commission_rate ?? 0,
  });

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/promoters/' + promoter.id, {
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

  const fieldStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 14,
    marginBottom: 16,
    boxSizing: 'border-box' as const,
  };
  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700 as const,
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      <label style={labelStyle}>Display name</label>
      <input
        type="text"
        value={form.display_name}
        onChange={(e) => update('display_name', e.target.value)}
        style={fieldStyle}
        placeholder="Your promoter name"
      />

      <label style={labelStyle}>City</label>
      <input
        type="text"
        value={form.city}
        onChange={(e) => update('city', e.target.value)}
        style={fieldStyle}
        placeholder="London"
      />

      <label style={labelStyle}>Bio</label>
      <textarea
        value={form.bio}
        onChange={(e) => update('bio', e.target.value)}
        rows={4}
        style={{ ...fieldStyle, resize: 'vertical' as const, fontFamily: 'inherit' }}
        placeholder="Tell fans and artists about your events"
      />

      <label style={labelStyle}>Instagram handle</label>
      <input
        type="text"
        value={form.instagram}
        onChange={(e) => update('instagram', e.target.value)}
        style={fieldStyle}
        placeholder="nightshiftpresents"
      />

      <label style={labelStyle}>TikTok handle</label>
      <input
        type="text"
        value={form.tiktok}
        onChange={(e) => update('tiktok', e.target.value)}
        style={fieldStyle}
        placeholder="nightshiftpresents"
      />

      <label style={labelStyle}>YouTube handle</label>
      <input
        type="text"
        value={form.youtube}
        onChange={(e) => update('youtube', e.target.value)}
        style={fieldStyle}
        placeholder="nightshiftpresents"
      />

      <label style={labelStyle}>Commission rate (%)</label>
      <input
        type="number"
        value={form.commission_rate}
        onChange={(e) => update('commission_rate', Number(e.target.value))}
        style={fieldStyle}
        min={0}
        max={100}
      />

      {error && (
        <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</p>
      )}
      {saved && (
        <p style={{ color: '#10b981', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>
          Saved. Your public profile is updated.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px 24px',
          borderRadius: 8,
          background: '#111827',
          color: '#ffffff',
          border: 'none',
          fontSize: 14,
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}