'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

const s: Record<string, CSSProperties> = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 100 },
  modal: { background: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 500, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#111827' },
  sub: { margin: '0 0 24px', fontSize: 14, color: '#6b7280' },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#374151' },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, outline: 'none', fontFamily: 'inherit' },
  textarea: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, outline: 'none', fontFamily: 'inherit', minHeight: 100, resize: 'vertical' },
  actionRow: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
  btnCancel: { padding: '10px 16px', borderRadius: 8, background: 'transparent', border: 'none', color: '#6b7280', fontWeight: 600, cursor: 'pointer' },
  btnSend: { padding: '10px 16px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer' },
};

export default function DemoSubmissionModal({ 
  isOpen, 
  onClose, 
  recipientName, 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  recipientName: string; 
}) {
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        {isSent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <h2 style={s.title}>Demo Sent!</h2>
            <p style={s.sub}>{recipientName} will review your track and get back to you.</p>
          </div>
        ) : (
          <>
            <h2 style={s.title}>Submit Demo to {recipientName}</h2>
            <p style={s.sub}>Keep it short. A link and a one-liner is all they need.</p>
            
            <div style={s.formGroup}>
              <label style={s.label}>Track URL (SoundCloud, Spotify, etc.)</label>
              <input style={s.input} placeholder="https://soundcloud.com/your-artist/your-track" />
            </div>
            
            <div style={s.formGroup}>
              <label style={s.label}>Your Pitch (1-2 sentences)</label>
              <textarea 
                style={s.textarea} 
                placeholder="Why does this track fit their roster? Include your socials if they want to follow up."
              />
            </div>

            <div style={s.actionRow}>
              <button style={s.btnCancel} onClick={onClose}>Cancel</button>
              <button style={s.btnSend} onClick={handleSend}>Send Demo</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
