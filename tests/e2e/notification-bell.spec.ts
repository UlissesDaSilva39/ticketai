import { test, expect } from "./fixtures/base";

// Notification Bell - full suite
// Skips gracefully if the auth fixture is missing.

test.describe("NotificationBell - header", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    // If the auth fixture is missing, the page redirects to /login.
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required -- run with the auth fixture");
    }
  });

  test("bell link exists in header", async ({ page }) => {
    const bell = page.getByRole("link", { name: /notification/i }).first();
    expect(await bell.count()).toBeGreaterThan(0);
    await expect(bell).toBeVisible({ timeout: 15000 });
  });

  test("bell has an accessible name", async ({ page }) => {
    const bell = page.getByRole("link", { name: /notification/i }).first();
    const aria = await bell.getAttribute("aria-label");
    const text = (await bell.innerText().catch(() => "")).trim();
    expect(Boolean(aria) || text.length > 0).toBe(true);
  });

  test("bell href points to /notifications", async ({ page }) => {
    const bell = page.getByRole("link", { name: /notification/i }).first();
    const href = await bell.getAttribute("href");
    expect(href).toBe("/notifications");
  });

  test("clicking bell navigates to /notifications", async ({ page }) => {
    const bell = page.getByRole("link", { name: /notification/i }).first();

    // Start the navigation listener BEFORE clicking
    const navPromise = page
      .waitForURL(/\/notifications/, { timeout: 15000 })
      .catch(() => null);

    await bell.click();
    const result = await navPromise;

    // If auth is present, URL should be /notifications.
    // If auth silently expired, the app redirects to /login — treat as skip.
    const finalUrl = page.url();
    if (finalUrl.includes("/login")) {
      test.skip(true, "Auth required for /notifications");
    }

    expect(result).not.toBeNull();
    expect(finalUrl).toContain("/notifications");
  });
});
