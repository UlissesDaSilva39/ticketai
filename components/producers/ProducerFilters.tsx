'use client';

import { useState } from 'react';

const GENRES = ['All genres', 'Hip-Hop', 'House', 'Techno', 'Drill', 'R&B'];
const CITIES = ['All cities', 'London', 'Manchester', 'Berlin', 'Bristol'];
const KEYS   = ['All keys', 'Am', 'Cm', 'F', 'G', 'Dm'];
const BPM    = ['All BPM', '60-90', '90-130', '130-170', '170+'];

export function ProducerFilters() {
  const [genre, setGenre] = useState('All genres');
  const [city, setCity]   = useState('All cities');
  const [key, setKey]     = useState('All keys');
  const [bpm, setBpm]     = useState('All BPM');

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
        {KEYS.map((k) => (
          <Chip key={k} active={key === k} onClick={() => setKey(k)}>{k}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {BPM.map((b) => (
          <Chip key={b} active={bpm === b} onClick={() => setBpm(b)}>{b}</Chip>
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