'use client';

import { useState } from 'react';

const STYLES = ['All genres', 'House', 'Techno', 'DnB', 'Disco', 'Hip-Hop'];
const CITIES = ['All cities', 'London', 'Manchester', 'Berlin', 'Bristol'];
const TIERS  = ['All tiers', 'Resident', 'Headliner', 'International'];
const DRAWS  = ['All draw', '<200', '200-500', '500-1500', '1500+'];
const FEES   = ['All fees', 'Under £500', '£500-£1000', '£1000+'];

export function DjFilters() {
  const [style, setStyle] = useState('All genres');
  const [city, setCity]   = useState('All cities');
  const [tier, setTier]   = useState('All tiers');
  const [draw, setDraw]   = useState('All draw');
  const [fee, setFee]     = useState('All fees');

  return (
    <section className="sticky top-16 z-30 -mx-6 mb-8 border-y border-neutral-200 bg-white/85 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        {STYLES.map((s) => (
          <Chip key={s} active={style === s} onClick={() => setStyle(s)}>{s}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {CITIES.map((c) => (
          <Chip key={c} active={city === c} onClick={() => setCity(c)}>{c}</Chip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {TIERS.map((t) => (
          <Chip key={t} active={tier === t} onClick={() => setTier(t)}>{t}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {DRAWS.map((d) => (
          <Chip key={d} active={draw === d} onClick={() => setDraw(d)}>{d}</Chip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {FEES.map((f) => (
          <Chip key={f} active={fee === f} onClick={() => setFee(f)}>{f}</Chip>
        ))}
      </div>
    </section>
  );
}

function Chip({
  children, active, onClick,
}: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={
        'rounded-full border px-4 py-1.5 text-sm font-medium transition ' +
        (active
          ? 'border-black bg-black text-white'
          : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900')
      }>
      {children}
    </button>
  );
}