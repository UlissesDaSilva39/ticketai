'use client';

import { useState } from 'react';
import MessageModal from '@/components/people/MessageModal';
import {
  TagIcon,
  UsersIcon,
  FlameIcon,
  MailIcon,
  MusicIcon,
  TrophyIcon,
  CalendarIcon,
} from '@/components/people/Icons';

const PROFILE_DATA = {
  name: 'Echo Chamber Records',
  initials: 'ER',
  handle: '@echochamber',
  role: 'Independent Label',
  city: 'London',
  followers: '1,240',
  signedArtists: 12,
  bio: 'Echo Chamber Records is an independent electronic label based in London. We focus on underground club music, vinyl releases, and breaking new talent.',
  lookingFor: ['Techno', 'Deep House', 'Minimal'],
  activity: [
    { key: 'music',    text: 'Signed Analog Dreams (Nov 2026)' },
    { key: 'calendar', text: "Released 'Midnight London' EP (Oct 2026)" },
    { key: 'trophy',   text: '1 Million Streams (Sep 2026)' },
  ] as { key: 'music' | 'calendar' | 'trophy'; text: string }[],
};

export default function PeopleProfilePage() {
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  return (
    <main style={{ background: '#f9fafb', minHeight: '100vh', paddingBottom: 64 }}>
      <div style={{ height: 200, background: 'linear-gradient(135deg, #1f2937, #111827)' }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', position: 'relative', top: -40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
            <div style={{ width: 120, height: 120, borderRadius: 16, background: '#ffffff', border: '4px solid #ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'grid', placeItems: 'center', fontSize: 36, fontWeight: 700, color: '#111827' }}>
              {PROFILE_DATA.initials}
            </div>
            <div style={{ paddingBottom: 12 }}>
              <h1 style={{ margin: '0 0 4px', fontSize: 32, fontWeight: 800, color: '#111827' }}>{PROFILE_DATA.name}</h1>
              <p style={{ margin: '0 0 8px', fontSize: 15, color: '#6b7280' }}>{PROFILE_DATA.handle}</p>
              <p style={{ margin: 0, fontSize: 14, color: '#374151', fontWeight: 500, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <TagIcon width={14} height={14} /> {PROFILE_DATA.role}
                <span>·</span>
                <span>{PROFILE_DATA.city}</span>
                <span>·</span>
                <UsersIcon width={14} height={14} /> {PROFILE_DATA.followers} followers
                <span>·</span>
                <MusicIcon width={14} height={14} /> {PROFILE_DATA.signedArtists} Artists
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, paddingBottom: 12 }}>
            <button style={{ padding: '10px 24px', borderRadius: 999, background: '#ffffff', border: '1px solid #d1d5db', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Follow
            </button>
            <button
              onClick={() => setIsMessageOpen(true)}
              style={{ padding: '10px 24px', borderRadius: 999, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <MailIcon width={14} height={14} /> Message
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginTop: 32 }}>
          <div>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600 }}>About</h2>
              <p style={{ margin: '0 0 24px', fontSize: 15, color: '#4b5563', lineHeight: 1.6 }}>{PROFILE_DATA.bio}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 14 }}>
                <div><span style={{ color: '#6b7280' }}>Founded:</span> <strong>2018</strong></div>
                <div><span style={{ color: '#6b7280' }}>Location:</span> <strong>London, UK</strong></div>
                <div><span style={{ color: '#6b7280' }}>Website:</span> <strong>echochamber.co.uk</strong></div>
                <div><span style={{ color: '#6b7280' }}>Focus:</span> <strong>Electronic</strong></div>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600 }}>Recent Activity</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {PROFILE_DATA.activity.map((act, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, fontSize: 14, color: '#374151', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280' }}>
                      {act.key === 'music' && <MusicIcon />}
                      {act.key === 'calendar' && <CalendarIcon />}
                      {act.key === 'trophy' && <TrophyIcon />}
                    </span>
                    <span>{act.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, position: 'sticky', top: 24 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FlameIcon width={18} height={18} /> Currently Looking For
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {PROFILE_DATA.lookingFor.map(tag => (
                  <span key={tag} style={{ background: '#f3f4f6', color: '#111827', padding: '6px 12px', borderRadius: 999, fontSize: 13, fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                If your sound matches these genres, we want to hear it.
              </p>
              <button
                onClick={() => setIsMessageOpen(true)}
                style={{ width: '100%', padding: '12px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
              >
                Submit Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        recipientName={PROFILE_DATA.name}
        recipientHandle={PROFILE_DATA.handle}
        defaultSubject="Demo Submission"
      />
    </main>
  );
}
