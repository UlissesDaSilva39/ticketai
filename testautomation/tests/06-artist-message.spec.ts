import { test, expect } from "@playwright/test";

const ARTIST_SLUG = process.env.ARTIST_SLUG || "demoticketaiorguk";

test.describe("Artist message modal", () => {
  test("opens the modal", async ({ page }) => {
    await page.goto(`/artist/${ARTIST_SLUG}`);
    await page.getByRole("button", { name: /message the artist/i }).click();
    await expect(page.getByPlaceholder(/your name/i)).toBeVisible();
  });

  test("closes on Escape", async ({ page }) => {
    await page.goto(`/artist/${ARTIST_SLUG}`);
    await page.getByRole("button", { name: /message the artist/i }).click();
    await expect(page.getByPlaceholder(/your name/i)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByPlaceholder(/your name/i)).not.toBeVisible();
  });

  test("submits a message", async ({ page }) => {
    await page.goto(`/artist/${ARTIST_SLUG}`);
    await page.getByRole("button", { name: /message the artist/i }).click();
    await page.getByPlaceholder(/your name/i).fill("Playwright Tester");
    await page.getByPlaceholder(/your email/i).fill("pw@example.com");
    await page.getByPlaceholder(/^message/i).fill("Hello from Playwright");
    await page.getByRole("button", { name: /^send$/i }).click();
    await expect(page.getByText(/message sent/i)).toBeVisible({ timeout: 10000 });
  });
});
