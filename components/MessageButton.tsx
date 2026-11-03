'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function MessageButton({ targetUserId }: { targetUserId: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([{ id: '1', text: 'Hey! Thanks for reaching out.', sender: 'them' }]);
  const [input, setInput] = useState('');

  useEffect(() => { setMounted(true); }, []);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: input, sender: 'me' }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Got it! I will get back to you soon.', sender: 'them' }]);
    }, 1000);
  }

  if (!mounted) return null;

  const chatModal = (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      width: '340px', height: '450px',
      background: '#fff', borderRadius: '16px',
      boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
      display: 'flex', flexDirection: 'column',
      zIndex: 2147483647,
      transform: 'translateZ(0)', // Forces a new stacking context above all cards
      border: '1px solid #e5e5e5', overflow: 'hidden'
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>New Message</div>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888', lineHeight: 1 }}>×</button>
      </div>
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map(m => (
          <div key={m.id} style={{ alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start', background: m.sender === 'me' ? '#111' : '#e5e5e5', color: m.sender === 'me' ? '#fff' : '#111', padding: '8px 12px', borderRadius: 12, fontSize: 14, maxWidth: '80%' }}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ padding: '12px', borderTop: '1px solid #e5e5e5', display: 'flex', gap: 8, background: '#fff' }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '10px 14px', borderRadius: 20, border: '1px solid #ccc', outline: 'none', fontSize: 14 }} />
        <button type="submit" style={{ padding: '10px 16px', borderRadius: 20, border: 'none', background: '#111', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Send</button>
      </form>
    </div>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={{ padding: '6px 16px', borderRadius: '999px', border: '1px solid #cccccc', background: '#ffffff', color: '#111111', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
        Message
      </button>
      {open && createPortal(chatModal, document.body)}
    </>
  );
}
