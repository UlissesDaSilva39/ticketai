import { test, expect } from "@playwright/test";

test.describe("00 - Smoke", () => {
  test("server responds on /login", async ({ page }) => {
    const res = await page.goto("/login");
    expect(res?.status()).toBe(200);
  });
  test("home page responds", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
  });
  test("login form is present", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input[type=\"email\"], input[name=\"email\"]").first()).toBeVisible();
    await expect(page.locator("input[type=\"password\"]").first()).toBeVisible();
  });
});
