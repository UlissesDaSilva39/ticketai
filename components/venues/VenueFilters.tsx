'use client';

import { useState } from 'react';

const TYPES   = ['All types', 'Club', 'Live', 'Warehouse', 'Pub', 'Festival'];
const CITIES  = ['All cities', 'London', 'Manchester', 'Berlin', 'Bristol'];
const CAPS    = ['All capacities', '<200', '200-500', '500-1000', '1000+'];
const DEALS   = ['All deals', 'Flat fee', 'Bar split', 'Door split'];
const TECH    = ['All tech', 'Full PA', 'Lights', 'Backline', 'Engineer'];
const PRICE   = ['All prices', 'Under £500', '£500-£1500', '£1500+'];

export function VenueFilters() {
  const [type, setType]   = useState('All types');
  const [city, setCity]   = useState('All cities');
  const [cap, setCap]     = useState('All capacities');
  const [deal, setDeal]   = useState('All deals');
  const [tech, setTech]   = useState('All tech');
  const [price, setPrice] = useState('All prices');

  return (
    <section className="sticky top-16 z-30 -mx-6 mb-8 border-y border-neutral-200 bg-white/85 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        {TYPES.map((t) => (
          <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {CITIES.map((c) => (
          <Chip key={c} active={city === c} onClick={() => setCity(c)}>{c}</Chip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {CAPS.map((c) => (
          <Chip key={c} active={cap === c} onClick={() => setCap(c)}>{c}</Chip>
        ))}
        <span className="mx-2 h-5 w-px bg-neutral-200" aria-hidden />
        {DEALS.map((d) => (
          <Chip key={d} active={deal === d} onClick={() => setDeal(d)}>{d}</Chip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {TECH.map((t) => (
          <Chip key={t} active={tech === t} onClick={() => setTech(t)}>{t}</Chip>
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