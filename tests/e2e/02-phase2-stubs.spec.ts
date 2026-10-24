import { test, expect } from '@playwright/test';

test.describe('Phase 2 - Stubs', () => {
  test('TC-2.1: /discover/festivals renders list or empty state', async ({ page }) => {
    await page.goto('/discover/festivals');
    await expect(page.locator('text=/Coming soon/i')).toHaveCount(0);
    const card = await page.locator('[data-testid="festival-card"], article').count();
    const empty = await page.locator('text=/No festivals listed|List your festival/i').count();
    expect(card + empty).toBeGreaterThan(0);
  });

  test('TC-2.2: /discover/labels renders list or empty state', async ({ page }) => {
    await page.goto('/discover/labels');
    await expect(page.locator('text=/Coming soon/i')).toHaveCount(0);
    const card = await page.locator('[data-testid="label-card"], article').count();
    const empty = await page.locator('text=/No labels listed|Claim your label/i').count();
    expect(card + empty).toBeGreaterThan(0);
  });

  test('TC-2.3: /network/messages requires auth', async ({ page }) => {
    await page.goto('/network/messages');
    await page.waitForLoadState('networkidle');
    const onLogin = page.url().includes('/login');
    const authCTA = await page.locator('text=/sign in|log in|create an account/i').count();
    expect(onLogin || authCTA > 0).toBeTruthy();
  });
});
