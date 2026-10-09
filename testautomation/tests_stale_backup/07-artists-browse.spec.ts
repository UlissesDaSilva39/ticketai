import { test, expect } from "@playwright/test";

test.describe("Browse artists page", () => {
  test("loads /artists", async ({ page }) => {
    const res = await page.goto("/artists");
    expect(res?.status()).toBeLessThan(400);
  });

  test("dropdown 'Browse all artists' navigates to /artists", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /artists/i }).first().click();
    const browseLink = page.getByRole("menuitem", { name: /browse all artists/i });
    await expect(browseLink).toBeVisible();
    await browseLink.click();
    await expect(page).toHaveURL(/\/artists/);
  });
});
