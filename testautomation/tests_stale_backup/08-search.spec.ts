import { test, expect } from "@playwright/test";

test.describe("Search page", () => {
  test("loads /search", async ({ page }) => {
    const res = await page.goto("/search");
    expect(res?.status()).toBeLessThan(400);
  });
});
