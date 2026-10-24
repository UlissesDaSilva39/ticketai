import { test, expect } from '@playwright/test';

test.describe('Phase 0 - Broken links', () => {
  test('TC-0.1: every artist View button resolves to 200', async ({ page }) => {
    await page.goto('/discover/artists');
    const viewButtons = page.locator('button:has-text("View")').filter({ hasNotText: 'View Profile' });
    const count = await viewButtons.count();
    test.skip(count === 0, 'No View buttons found');
    for (let i = 0; i < count && i < 5; i++) {
      const [response] = await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => null),
        viewButtons.nth(i).click(),
      ]);
      expect(response?.status(), `View #${i} -> ${page.url()}`).toBe(200);
      await page.goBack();
    }
  });

  test('TC-0.2: artist Join Club button resolves to 200', async ({ page }) => {
    await page.goto('/discover/artists');
    const joinButtons = page.locator('button:has-text("Join Club")');
    const count = await joinButtons.count();
    test.skip(count === 0, 'No Join Club buttons');
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => null),
      joinButtons.first().click(),
    ]);
    expect(response?.status()).toBe(200);
  });

  test('TC-0.3: featured artist URL is slugified', async ({ page }) => {
    await page.goto('/discover/artists');
    const btn = page.locator('button:has-text("View Profile")').first();
    test.skip((await btn.count()) === 0, 'No featured buttons');
    await btn.click();
    await page.waitForURL(/\/artist\//, { timeout: 5000 });
    const url = page.url();
    expect(url).not.toMatch(/\s/);
  });

  test('TC-0.4: advertise form posts successfully', async ({ page }) => {
    await page.goto('/advertise');
    await page.fill('input[type="text"]', 'Playwright Tester');
    await page.fill('input[type="email"]', 'pw@test.local');
    await page.selectOption('select', 'Event');
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/advertise') && r.request().method() === 'POST', { timeout: 10000 }).catch(() => null),
      page.click('button[type="submit"]'),
    ]);
    expect(response, 'No POST /api/advertise response').not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
  });

  test('TC-0.5: advertise upsell modals open and dismiss', async ({ page }) => {
    await page.goto('/advertise');
    await page.click('button:has-text("Get Started")');
    await expect(page.locator('text=/Want 3x more clicks/i')).toBeVisible();
    await page.click('button:has-text("No thanks")');
    await expect(page.locator('text=/Want 3x more clicks/i')).not.toBeVisible();
    await page.click('button:has-text("Choose Premium")');
    await expect(page.locator('text=/Go Enterprise/i')).toBeVisible();
    await page.click('button:has-text("No thanks")');
  });
});
