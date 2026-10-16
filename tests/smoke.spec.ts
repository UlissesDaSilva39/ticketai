import { test, expect } from '@playwright/test';

test('promoters page loads and message flow works', async ({ page }) => {
  await page.goto('/promoters');

  await expect(page.getByRole('heading', { name: /PROMOTERS/i, level: 1 })).toBeVisible();
  await expect(page.locator('#promoters article')).toHaveCount(21);

  const firstCard = page.locator('#promoters article').first();
  await expect(firstCard.getByRole('link', { name: /GET TICKETS/i })).toBeVisible();

  await page.route('**/api/messages', (route) =>
    route.fulfill({ status: 200, body: '{"ok":true}' })
  );

  await firstCard.getByRole('button', { name: /^Message$/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('#message-body').fill('Hi, quick question about Saturday.');
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.getByText(/Message sent/i)).toBeVisible();
});