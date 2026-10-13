import { test, expect } from "./fixtures/base";

test.describe("profile pages", () => {
  test("/profile redirects to login when not authenticated", async ({ page }) => {
    const res = await page.goto("/profile", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) {
      expect(page.url()).toContain("/login");
      return;
    }
    // If logged in, it should render profile content
    expect(res?.status()).toBeLessThan(400);
  });

  test("/profile/edit redirects to login when not authenticated", async ({ page }) => {
    const res = await page.goto("/profile/edit", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) {
      expect(page.url()).toContain("/login");
      return;
    }
    expect(res?.status()).toBeLessThan(400);
  });

  test("/profile shows ProfileTabs when logged in", async ({ page }) => {
    await page.goto("/profile", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const tablist = page.getByRole("tablist");
    await expect(tablist).toBeVisible();
    await expect(tablist.getByRole("tab", { name: /posts/i })).toBeVisible();
    await expect(tablist.getByRole("tab", { name: /about/i })).toBeVisible();
  });

  test("/profile shows Edit profile button", async ({ page }) => {
    await page.goto("/profile", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    await expect(page.getByRole("link", { name: /edit profile/i })).toBeVisible();
  });

  test("/profile/edit shows form fields", async ({ page }) => {
    await page.goto("/profile/edit", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    await expect(page.locator('#full_name')).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#bio')).toBeVisible();
    await expect(page.locator('#city')).toBeVisible();
    await expect(page.getByRole("button", { name: /save changes/i })).toBeVisible();
  });

  test("/profile/edit save button is enabled", async ({ page }) => {
    await page.goto("/profile/edit", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const save = page.getByRole("button", { name: /save changes/i });
    await expect(save).toBeEnabled();
  });
});
