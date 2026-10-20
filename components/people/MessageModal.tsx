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
  textarea: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, outline: 'none', fontFamily: 'inherit', minHeight: 120, resize: 'vertical' },
  actionRow: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 },
  btnCancel: { padding: '10px 16px', borderRadius: 8, background: 'transparent', border: 'none', color: '#6b7280', fontWeight: 600, cursor: 'pointer' },
  btnSend: { padding: '10px 16px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer' },
};

export default function MessageModal({ 
  isOpen, 
  onClose, 
  recipientName, 
  recipientHandle,
  defaultSubject = ''
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  recipientName: string; 
  recipientHandle: string;
  defaultSubject?: string;
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
            <h2 style={s.title}>Message sent!</h2>
            <p style={s.sub}>{recipientName} will get back to you shortly.</p>
          </div>
        ) : (
          <>
            <h2 style={s.title}>Message {recipientName}</h2>
            <p style={s.sub}>{recipientHandle}</p>
            
            <div style={s.formGroup}>
              <label style={s.label}>Subject</label>
              <input 
                style={s.input} 
                defaultValue={defaultSubject || `Inquiry from GRID`} 
              />
            </div>
            
            <div style={s.formGroup}>
              <label style={s.label}>Message</label>
              <textarea 
                style={s.textarea} 
                defaultValue={`Hi ${recipientName.split(' ')[0]},\n\nI saw you're looking for new artists on GRID.\n\nI'd love to share my latest track with you.`}
              />
            </div>

            <div style={s.actionRow}>
              <button style={s.btnCancel} onClick={onClose}>Cancel</button>
              <button style={s.btnSend} onClick={handleSend}>Send Message</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
