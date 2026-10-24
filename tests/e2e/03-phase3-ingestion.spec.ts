import { test, expect } from '@playwright/test';

test.describe('Phase 3 - Ingestion', () => {
  test('TC-3.8: sync endpoint requires auth', async ({ request }) => {
    const res = await request.post('/api/ingestion/sync', { data: { source: 'ticketmaster' } });
    expect([401, 403, 404]).toContain(res.status());
  });
});
