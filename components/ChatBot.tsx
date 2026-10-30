'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, FormEvent } from 'react';
import { createPortal } from 'react-dom';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error } = useChat();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const isLoading = status === 'streaming' || status === 'submitted';

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  const renderText = (m: any) => {
    if (typeof m.content === 'string' && m.content.length > 0) return m.content;
    if (Array.isArray(m.parts)) {
      return m.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('');
    }
    return '';
  };

  const ui = (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle chat"
        style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 2147483647,
          width: '60px', height: '60px', borderRadius: '50%',
          background: '#111111', color: '#ffffff', border: '2px solid #ffffff',
          fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {open ? 'X' : 'Chat'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '92px', right: '20px', zIndex: 2147483647,
          width: '360px', maxWidth: 'calc(100vw - 40px)', height: '480px',
          display: 'flex', flexDirection: 'column',
          background: '#ffffff', borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '1px solid #e5e5e5',
        }}>
          <div style={{ padding: '12px 16px', background: '#111111', color: '#ffffff', fontWeight: 600 }}>
            Support Assistant
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: '#fafafa' }}>
            {messages.length === 0 && (
              <p style={{ color: '#888888', fontSize: '14px' }}>
                Ask about ticket fees, merchandise, refunds, or shipping.
              </p>
            )}
            {messages.map(m => (
              <div key={m.id} style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '8px',
              }}>
                <div style={{
                  maxWidth: '85%', padding: '8px 12px', borderRadius: '12px',
                  fontSize: '14px', whiteSpace: 'pre-wrap',
                  background: m.role === 'user' ? '#111111' : '#e9e9e9',
                  color: m.role === 'user' ? '#ffffff' : '#111111',
                }}>
                  {renderText(m)}
                </div>
              </div>
            ))}
            {isLoading && <p style={{ color: '#888888', fontSize: '13px' }}>Searching...</p>}
            {error && <p style={{ color: 'red', fontSize: '13px' }}>Error: {error.message}</p>}
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid #e5e5e5' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              style={{ flex: 1, padding: '8px 10px', border: '1px solid #cccccc', borderRadius: '8px', fontSize: '14px' }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                padding: '8px 14px', borderRadius: '8px', border: 'none',
                background: isLoading ? '#999999' : '#111111', color: '#ffffff',
                cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '14px',
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return createPortal(ui, document.body);
}
