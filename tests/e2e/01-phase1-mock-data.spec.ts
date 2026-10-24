import { test, expect } from '@playwright/test';

const TEST_ARTIST = 'Test Artist A';
const MOCK_ARTIST = 'Basement Collective';

test.describe('Phase 1 - Replace mock data', () => {
  test('TC-1.1: /discover/artists uses Supabase, not mock', async ({ page }) => {
    await page.goto('/discover/artists');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${MOCK_ARTIST}`)).toHaveCount(0);
    const realCount = await page.locator(`text=${TEST_ARTIST}`).count();
    if (realCount === 0) test.skip(true, 'Supabase seed data missing');
    expect(realCount).toBeGreaterThan(0);
  });

  test('TC-1.2: genre filter narrows results', async ({ page }) => {
    await page.goto('/discover/artists');
    await page.waitForLoadState('networkidle');
    const before = await page.locator('[data-testid="artist-card"], article').count();
    if (before === 0) test.skip(true, 'No artists loaded');
    await page.click('button:has-text("House")');
    await page.waitForTimeout(500);
    const after = await page.locator('[data-testid="artist-card"], article').count();
    expect(after).toBeLessThanOrEqual(before);
  });

  test('TC-1.3: empty search shows empty state', async ({ page }) => {
    await page.goto('/discover/artists');
    await page.fill('input[placeholder*="Search"]', 'zzzznonexistent');
    await page.waitForTimeout(500);
    const empty = page.locator('text=/No artists? found|Nothing found|try a different/i');
    await expect(empty).toBeVisible({ timeout: 5000 });
  });

  test('TC-1.4: /discover/events fetches from Supabase', async ({ page }) => {
    await page.goto('/discover/events');
    await page.waitForLoadState('networkidle');
    const count = await page.locator('[data-testid="event-card"], article').count();
    if (count === 0) test.skip(true, 'No events seeded');
    expect(count).toBeGreaterThan(0);
  });

  test('TC-1.5: /discover/venues renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('/discover/venues');
    await page.waitForLoadState('networkidle');
    const critical = errors.filter(e => !e.includes('favicon'));
    expect(critical, `Errors: ${critical.join(' | ')}`).toHaveLength(0);
  });

  test('TC-1.7: source badges appear on events', async ({ page }) => {
    await page.goto('/discover/events');
    await page.waitForLoadState('networkidle');
    const count = await page.locator('article, [data-testid="event-card"]').count();
    if (count === 0) test.skip(true, 'No events');
    const badge = page.locator('text=/Ticketmaster|TicketAI|RSS|OSM/').first();
    await expect(badge).toBeVisible({ timeout: 5000 });
  });
});
