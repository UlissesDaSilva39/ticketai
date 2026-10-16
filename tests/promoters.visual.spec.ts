import { test, expect, gotoPromoters } from './fixtures';

test.describe('GRID Promoters — visual', () => {
  test('full page snapshot — desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoPromoters(page);
    await page.addStyleTag({
      content: `*, *::before, *::after { animation: none !important; transition: none !important; }`,
    });
    await expect(page).toHaveScreenshot('promoters-desktop.png', {
      fullPage: true,
      maxDiffPixels: 300,
    });
  });

  test('full page snapshot — mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoPromoters(page);
    await expect(page).toHaveScreenshot('promoters-mobile.png', {
      fullPage: true,
      maxDiffPixels: 300,
    });
  });

  test('message modal snapshot', async ({ page }) => {
    await gotoPromoters(page);
    await page.getByRole('button', { name: /^Message$/ }).first().click();
    await expect(page.getByRole('dialog')).toHaveScreenshot('message-modal.png', {
      maxDiffPixels: 150,
    });
  });
});