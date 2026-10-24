'use client';

import { useState, useEffect } from 'react';

type RssItem = {
  id: string;
  source_name: string;
  title: string;
  link: string;
  pub_date: string | null;
};

export default function MusicNewsSection() {
  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/rss')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.items)) setItems(data.items.slice(0, 10));
      })
      .catch((err) => console.warn('rss fetch failed', err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function relativeTime(iso: string | null): string {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + 'm ago';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + 'h ago';
    return Math.floor(hours / 24) + 'd ago';
  }

  if (loading) {
    return (
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-antonio)' }}>Music News</h2>
        <div className="space-y-2">
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-antonio)' }}>Music News</h2>
        <span className="text-xs text-gray-500">{items.length} from industry feeds</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {item.source_name}
              </span>
              <span className="text-xs text-gray-400">{relativeTime(item.pub_date)}</span>
            </div>
            <p className="text-sm font-medium text-gray-900 leading-snug">{item.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
}