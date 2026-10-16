'use client';

import { useState } from 'react';

const ROLES   = ['All roles', 'Singer', 'Rapper', 'Topliner', 'Instrumentalist'];
const GENRES  = ['All genres', 'R&B', 'Hip-Hop', 'Pop', 'Soul', 'Electronic'];
const CITIES  = ['All cities', 'London', 'Manchester', 'Berlin', 'Bristol'];
const KEYS    = ['All keys', 'Am', 'Cm', 'F', 'G', 'Dm'];
const PRICE   = ['All rates', 'Under £200', '£200-£400', '£400+'];

export function ArtistFilters() {
  const [role, setRole]   = useState('All roles');
  const [genre, setGenre] = useState('All genres');
  const [city, setCity]   = useState('All cities');
  const [key, setKey]     = useState('All keys');
  const [price, setPrice] = useState('All rates');

  return (
    <section className="sticky top-16 z-30 -mx-6 mb-8 border-y border-neutral-200 bg-white/85 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        {ROLES.map((r) => (
          <Chip key={r} active={role === r} onClick={() => setRole(r)}>{r}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {GENRES.map((g) => (
          <Chip key={g} active={genre === g} onClick={() => setGenre(g)}>{g}</Chip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {CITIES.map((c) => (
          <Chip key={c} active={city === c} onClick={() => setCity(c)}>{c}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {KEYS.map((k) => (
          <Chip key={k} active={key === k} onClick={() => setKey(k)}>{k}</Chip>
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