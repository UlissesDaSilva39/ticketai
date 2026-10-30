'use client';

import { useState } from 'react';

export default function NetworkPrompt() {
  const [query, setQuery] = useState('');

  return (
    <div style={{
      padding: '16px',
      borderBottom: '1px solid #e5e5e5',
      background: '#ffffff',
    }}>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
        Ask the GRID network — find a collaborator, a venue, or a promoter.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!query.trim()) return;
          window.location.href = '/search?q=' + encodeURIComponent(query) + '&type=people';
        }}
        style={{ display: 'flex', gap: '8px' }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. techno promoter in Berlin, jazz vocalist for a session..."
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #cccccc',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        />
        <button
          type="submit"
          disabled={!query.trim()}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: query.trim() ? '#111111' : '#999999',
            color: '#ffffff',
            cursor: query.trim() ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Ask
        </button>
      </form>
    </div>
  );
}
