'use client';

import { useState } from 'react';

const CITIES = ['All cities', 'London', 'Manchester', 'Berlin', 'Bristol'];
const GENRES = ['All genres', 'House', 'Techno', 'Jazz', 'DnB'];
const WHEN   = ['This weekend', 'Under £20', 'Free'];

export function PromoterFilters() {
  const [city, setCity]   = useState('All cities');
  const [genre, setGenre] = useState('All genres');
  const [when, setWhen]   = useState<string | null>(null);

  return (
    <section className="sticky top-16 z-30 -mx-6 mb-8 border-y border-neutral-200 bg-white/85 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        {CITIES.map((c) => (
          <Chip key={c} active={city === c} onClick={() => setCity(c)}>{c}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {GENRES.map((g) => (
          <Chip key={g} active={genre === g} onClick={() => setGenre(g)}>{g}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {WHEN.map((w) => (
          <Chip key={w} active={when === w} onClick={() => setWhen(when === w ? null : w)}>
            {w}
          </Chip>
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