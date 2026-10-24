import { test, expect } from '@playwright/test';

test.describe('Cross-cutting', () => {
  test('TC-X.1: every nav route resolves', async ({ page }) => {
    const routes = [
      '/', '/discover/events', '/discover/artists', '/discover/venues',
      '/discover/promoters', '/discover/festivals', '/discover/labels',
      '/feed', '/network', '/network/connections', '/network/messages',
      '/opportunities', '/my-tickets', '/search', '/profile', '/settings', '/advertise',
    ];
    for (const route of routes) {
      const res = await page.request.get(route);
      expect(res.status(), `${route} -> ${res.status()}`).toBeLessThan(400);
    }
  });

  test('TC-X.4: mobile nav opens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    const toggle = page.locator('button[aria-label*="menu" i], button[aria-label*="nav" i]').first();
    test.skip((await toggle.count()) === 0, 'No mobile toggle found');
    await toggle.click();
    await page.waitForTimeout(300);
    const feedLink = page.locator('a:has-text("Feed")').first();
    await expect(feedLink).toBeVisible({ timeout: 5000 });
  });

  test('TC-X.6: broken backend does not white-screen', async ({ page }) => {
    await page.route('**/rest/v1/**', r => r.fulfill({ status: 500, body: '{}' }));
    await page.goto('/discover/artists');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=/TypeError|Cannot read|Unhandled/i')).toHaveCount(0);
  });

  test('TC-X.7: protected pages redirect when logged out', async ({ page }) => {
    const routes = ['/my-tickets', '/profile', '/settings', '/network/messages', '/profile/following', '/artist/dashboard', '/admin'];
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const onLogin = page.url().includes('/login');
      const loginForm = await page.locator('input[type="password"], text=/sign in|log in/i').count();
      expect(onLogin || loginForm > 0, `${route} should redirect`).toBeTruthy();
    }
  });
});
