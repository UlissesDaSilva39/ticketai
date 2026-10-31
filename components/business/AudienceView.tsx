'use client';

import { useState } from 'react';

type AudiencePerson = {
  id: string;
  username: string | null;
  full_name: string | null;
  city: string | null;
  behavior: 'Follower' | 'Ticket buyer' | 'Messaged' | 'Club member';
  lastInteraction: string | null;
};

const DEMO: AudiencePerson[] = [
  { id: '1', username: 'rachelsterling', full_name: 'Rachel Sterling', city: 'London', behavior: 'Follower', lastInteraction: '2 days ago' },
  { id: '2', username: 'davidchen', full_name: 'David Chen', city: 'Manchester', behavior: 'Ticket buyer', lastInteraction: '1 week ago' },
  { id: '3', username: 'sophiebennett', full_name: 'Sophie Bennett', city: 'Brighton', behavior: 'Messaged', lastInteraction: '3 days ago' },
  { id: '4', username: 'marcusreid', full_name: 'Marcus Reid', city: 'London', behavior: 'Club member', lastInteraction: '1 day ago' },
  { id: '5', username: 'ninavasquez', full_name: 'Nina Vasquez', city: 'Berlin', behavior: 'Follower', lastInteraction: '2 weeks ago' },
];

const CITIES = ['All', 'London', 'Manchester', 'Berlin', 'Amsterdam', 'Paris', 'Brighton'];
const BEHAVIORS = ['All', 'Follower', 'Ticket buyer', 'Messaged', 'Club member'];

export default function AudienceView() {
  const [city, setCity] = useState('All');
  const [behavior, setBehavior] = useState('All');
  const [people] = useState<AudiencePerson[]>(DEMO);

  const filtered = people.filter(p =>
    (city === 'All' || p.city === city) &&
    (behavior === 'All' || p.behavior === behavior)
  );

  return (
    <section style={{ padding: '32px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888888', margin: 0 }}>
          Audience
        </h2>
        <span style={{ fontSize: '14px', color: '#666666' }}>
          {filtered.length.toLocaleString()} {filtered.length === 1 ? 'person' : 'people'}
        </span>
      </div>

      {people.length === 0 ? (
        <div style={{
          padding: '48px 24px', textAlign: 'center',
          border: '1px solid #e5e5e5', borderRadius: '16px', background: '#fafafa',
        }}>
          <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No audience yet</p>
          <p style={{ fontSize: '14px', color: '#666666', marginBottom: '20px' }}>
            Share your profile or list an event to start building your audience.
          </p>
          <button style={{
            padding: '10px 20px', borderRadius: '999px', border: 'none',
            background: '#111111', color: '#ffffff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          }}>
            Share your profile
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: '999px',
                border: '1px solid #cccccc', background: '#ffffff',
                fontSize: '14px', color: '#111111', cursor: 'pointer', minWidth: '180px',
              }}
            >
              {CITIES.map(c => <option key={c} value={c}>{c === 'All' ? 'City: All' : c}</option>)}
            </select>
            <select
              value={behavior}
              onChange={(e) => setBehavior(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: '999px',
                border: '1px solid #cccccc', background: '#ffffff',
                fontSize: '14px', color: '#111111', cursor: 'pointer', minWidth: '200px',
              }}
            >
              {BEHAVIORS.map(b => <option key={b} value={b}>{b === 'All' ? 'Behavior: All' : b}</option>)}
            </select>
          </div>

          <button style={{
            width: '100%', padding: '14px 24px', borderRadius: '999px', border: 'none',
            background: '#111111', color: '#ffffff', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', marginBottom: '24px',
          }}>
            Message this group ({filtered.length.toLocaleString()})
          </button>

          {filtered.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#666666' }}>
              No one matches {city !== 'All' ? city : 'these filters'} {behavior !== 'All' ? '+ ' + behavior : ''}.{' '}
              <button
                onClick={() => { setCity('All'); setBehavior('All'); }}
                style={{ background: 'none', border: 'none', color: '#111111', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}
              >
                Clear filters
              </button>
            </p>
          ) : (
            <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#fafafa', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888888', borderBottom: '1px solid #e5e5e5' }}>Name</th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888888', borderBottom: '1px solid #e5e5e5' }}>City</th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888888', borderBottom: '1px solid #e5e5e5' }}>Behavior</th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888888', borderBottom: '1px solid #e5e5e5' }}>Last interaction</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#111111' }}>{p.full_name || p.username || 'Someone'}</div>
                        {p.username && <div style={{ fontSize: '12px', color: '#888888' }}>@{p.username}</div>}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#666666' }}>{p.city || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#666666' }}>{p.behavior}</td>
                      <td style={{ padding: '14px 16px', color: '#999999' }}>{p.lastInteraction || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
