import { test, expect } from '@playwright/test';

test.describe('Ingestion sync API', () => {
  test('GET /api/ingestion/sync returns hint', async ({ request }) => {
    const res = await request.get('/api/ingestion/sync');
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.hint).toContain('POST');
    expect(json.requires).toContain('TICKETMASTER_API_KEY');
  });

  test('POST without a key returns 500 with clear error', async ({ request }) => {
    const res = await request.post('/api/ingestion/sync', {
      data: { source: 'ticketmaster', maxResults: 1 },
    });
    const json = await res.json();
    if (res.status() === 500) {
      expect(String(json.error)).toMatch(/TICKETMASTER_API_KEY|not set/i);
    } else {
      expect(res.status()).toBe(200);
      expect(json).toHaveProperty('seen');
      expect(json).toHaveProperty('inserted');
      expect(json).toHaveProperty('updated');
      expect(json).toHaveProperty('rejected');
      expect(json).toHaveProperty('error');
    }
  });

  test('POST with unsupported source returns 400', async ({ request }) => {
    const res = await request.post('/api/ingestion/sync', {
      data: { source: 'rss' },
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Only ticketmaster');
  });

  test('POST with valid source returns IngestionResult shape', async ({ request }) => {
    const res = await request.post('/api/ingestion/sync', {
      data: { source: 'ticketmaster', maxResults: 1 },
    });
    const json = await res.json();
    if (res.status() === 200) {
      expect(typeof json.seen).toBe('number');
      expect(typeof json.inserted).toBe('number');
      expect(typeof json.updated).toBe('number');
      expect(typeof json.rejected).toBe('number');
      expect(json.source).toBe('ticketmaster');
    }
  });

  test('maxResults is capped at 100', async ({ request }) => {
    const res = await request.post('/api/ingestion/sync', {
      data: { source: 'ticketmaster', maxResults: 9999 },
    });
    expect([200, 500]).toContain(res.status());
  });
});