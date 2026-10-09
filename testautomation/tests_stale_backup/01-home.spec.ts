import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads without error", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/TicketAI/i);
  });

  test("header contains main navigation", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    await expect(header).toBeVisible();
    await expect(header.getByRole("link", { name: /^home$/i })).toBeVisible();
    await expect(header.getByRole("link", { name: /^search$/i })).toBeVisible();
    await expect(header.getByRole("link", { name: /^artists/i })).toBeVisible();
  });

  test("footer contains legal links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer").first();
    await expect(footer.getByRole("link", { name: /terms of service/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /privacy policy/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /refund policy/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /contact/i })).toBeVisible();
  });
});
