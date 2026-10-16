'use client';

import { useState } from 'react';

const GENRES   = ['All genres', 'Rock', 'Indie', 'Punk', 'Electronic', 'Folk'];
const CITIES   = ['All cities', 'London', 'Manchester', 'Berlin', 'Bristol'];
const LINEUPS  = ['All lineups', 'Solo', 'Duo', 'Trio', '4-piece', '5-piece+'];
const DRAWS    = ['All draw', '<100', '100-500', '500-1000', '1000+'];
const PRICE    = ['All prices', 'Under £20', '£20-£50', '£50+'];

export function BandFilters() {
  const [genre, setGenre]   = useState('All genres');
  const [city, setCity]     = useState('All cities');
  const [lineup, setLineup] = useState('All lineups');
  const [draw, setDraw]     = useState('All draw');
  const [price, setPrice]   = useState('All prices');

  return (
    <section className="sticky top-16 z-30 -mx-6 mb-8 border-y border-neutral-200 bg-white/85 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        {GENRES.map((g) => (
          <Chip key={g} active={genre === g} onClick={() => setGenre(g)}>{g}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {CITIES.map((c) => (
          <Chip key={c} active={city === c} onClick={() => setCity(c)}>{c}</Chip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {LINEUPS.map((l) => (
          <Chip key={l} active={lineup === l} onClick={() => setLineup(l)}>{l}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {DRAWS.map((d) => (
          <Chip key={d} active={draw === d} onClick={() => setDraw(d)}>{d}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {PRICE.map((p) => (
          <Chip key={p} active={price === p} onClick={() => setPrice(p)}>{p}</Chip>
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