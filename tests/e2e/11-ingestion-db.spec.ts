import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

test.describe('Ingestion tables', () => {
  test.skip(!SUPABASE_URL || !SUPABASE_KEY, 'Supabase env vars not set');

  test('data_sources has 4 seeded rows', async ({ request }) => {
    const res = await request.get(
      SUPABASE_URL + '/rest/v1/data_sources?select=name,kind,enabled',
      { headers: { apikey: SUPABASE_KEY!, Authorization: 'Bearer ' + SUPABASE_KEY! } }
    );
    expect(res.status()).toBe(200);
    const rows = await res.json();
    expect(rows.length).toBeGreaterThanOrEqual(4);
    const names = rows.map((r: any) => r.name).sort();
    expect(names).toEqual(['manual', 'openstreetmap', 'rss', 'ticketmaster']);
  });

  test('external_records table exists', async ({ request }) => {
    const res = await request.get(
      SUPABASE_URL + '/rest/v1/external_records?select=id&limit=1',
      { headers: { apikey: SUPABASE_KEY!, Authorization: 'Bearer ' + SUPABASE_KEY! } }
    );
    expect(res.status()).toBe(200);
  });

  test('ingestion_runs table exists', async ({ request }) => {
    const res = await request.get(
      SUPABASE_URL + '/rest/v1/ingestion_runs?select=id,status&limit=1',
      { headers: { apikey: SUPABASE_KEY!, Authorization: 'Bearer ' + SUPABASE_KEY! } }
    );
    expect(res.status()).toBe(200);
  });

  test('source_attributions table exists', async ({ request }) => {
    const res = await request.get(
      SUPABASE_URL + '/rest/v1/source_attributions?select=id&limit=1',
      { headers: { apikey: SUPABASE_KEY!, Authorization: 'Bearer ' + SUPABASE_KEY! } }
    );
    expect(res.status()).toBe(200);
  });
});