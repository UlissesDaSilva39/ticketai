'use client';

import { useState } from 'react';
import Link from 'next/link';

type Tab = 'technical' | 'hospitality' | 'backstage';

export default function RiderPage() {
  const [tab, setTab] = useState<Tab>('technical');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-black">← Back to home</Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">Build your rider</h1>
          <p className="text-gray-600">
            One link for your technical, hospitality, and backstage requirements.
            Share with promoters and venues. No more Word docs.
          </p>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['technical', 'hospitality', 'backstage'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                'px-4 py-3 font-medium text-sm capitalize border-b-2 transition ' +
                (tab === t
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black')
              }
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'technical' && (
          <div className="space-y-4">
            <Field label="PA System" placeholder="e.g., d&b V-Series, 2x per side + 4x subs" />
            <Field label="Monitor Setup" placeholder="e.g., 4x wedges + 2x in-ear" />
            <Field label="Console Requirements" placeholder="e.g., Allen & Heath SQ-7 or equivalent" />
            <Field label="Backline" placeholder="e.g., DW drum kit, Fender Twin, Korg Kronos" />
            <Field label="Power Requirements" placeholder="e.g., 3-phase 63A" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Load-in time" placeholder="e.g., 14:00" />
              <Field label="Soundcheck time" placeholder="e.g., 17:00-18:00" />
            </div>
            <Field label="Notes" placeholder="Additional technical requirements..." multiline />
          </div>
        )}

        {tab === 'hospitality' && (
          <div className="space-y-4">
            <Field label="Catering" placeholder="e.g., Hot meal for 4 crew, vegetarian option" />
            <Field label="Dietary requirements" placeholder="e.g., 1 vegan, 1 gluten-free" />
            <Field label="Dressing room" placeholder="e.g., Private room, mirrors, towels" />
            <Field label="Transport" placeholder="e.g., Minibus pickup at 15:00" />
            <Field label="Accommodation" placeholder="e.g., 2 twin rooms, 1 night" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Guest list count" placeholder="e.g., 10" />
              <Field label="Merch commission %" placeholder="e.g., 20" />
            </div>
            <Field label="Settlement terms" placeholder="e.g., Cash on the night" />
            <Field label="Notes" placeholder="Additional hospitality requirements..." multiline />
          </div>
        )}

        {tab === 'backstage' && (
          <div className="space-y-4">
            <Field label="Venue map URL" placeholder="https://..." />
            <Field label="Door access levels" placeholder="e.g., Crew, Artist, VIP" />
            <Field label="Loading bay" placeholder="e.g., Rear entrance, 6m clearance" />
            <Field label="Storage available" placeholder="e.g., 20m² locked storage" />
            <Field label="Parking" placeholder="e.g., 2 secured spaces" />
            <Field label="Curfew time" placeholder="e.g., 23:00" />
            <Field label="Notes" placeholder="Additional backstage details..." multiline />
          </div>
        )}

        <div className="mt-8">
          <button
            type="button"
            onClick={() => alert('Save to DB — Supabase riders table needs to be created first')}
            className="w-full rounded-full bg-black text-white font-semibold py-3 hover:bg-neutral-800"
          >
            Save rider
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            Your rider is private until you share the link.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, multiline }: { label: string; placeholder?: string; multiline?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
        />
      )}
    </div>
  );
}
