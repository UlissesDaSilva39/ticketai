import { test as base, expect } from '@playwright/test';

export const test = base.extend<{
  consoleErrors: string[];
}>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await use(errors);
  },
});

export { expect };

// --- Shared helpers ---

export async function gotoPromoters(page: import('@playwright/test').Page) {
  await page.goto('/promoters');
  await page.waitForLoadState('networkidle');
}

export async function getFirstCard(page: import('@playwright/test').Page) {
  return page.locator('article').filter({ hasText: 'Next event' }).first();
}

export async function getFirstMessageButton(page: import('@playwright/test').Page) {
  return page.getByRole('button', { name: /^Message$/ }).first();
}