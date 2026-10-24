import { test, expect } from '@playwright/test';

test.describe('Phase 4 - Social', () => {
  test('TC-4.1: /artist/dashboard gated for non-artist', async ({ page }) => {
    await page.goto('/artist/dashboard');
    await page.waitForLoadState('networkidle');
    const onLogin = page.url().includes('/login');
    const noAccess = await page.locator('text=/artist profile|not authorised|sign in/i').count();
    expect(onLogin || noAccess > 0).toBeTruthy();
  });

  test('TC-4.5: /admin gated for non-admin', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const onLogin = page.url().includes('/login');
    const notAdmin = await page.locator('text=/unauthorised|access denied|sign in/i').count();
    expect(onLogin || notAdmin > 0).toBeTruthy();
  });

  test('TC-4.6: search returns results or empty state', async ({ page }) => {
    await page.goto('/search?q=Test');
    await page.waitForLoadState('networkidle');
    const hasResults = (await page.locator('article, [data-testid]').count()) > 0;
    const hasEmpty = (await page.locator('text=/no results|nothing found/i').count()) > 0;
    expect(hasResults || hasEmpty).toBeTruthy();
  });
});
