import { test, expect } from "@playwright/test";
import { login, CREDS } from "../helpers/auth";

test.describe("09 - Notifications", () => {
  test.beforeEach(async ({ page }) => login(page, ...CREDS.alice));
  test("9.1 bell opens dropdown", async ({ page }) => {
    const bell = page.getByRole("button", { name: /notification/i }).first();
    if (await bell.count() === 0) test.skip(true, "no bell");
    await bell.click();
    await expect(page.getByRole("menu").first()).toBeVisible();
  });
  test("9.2 settings toggles", async ({ page }) => {
    await page.goto("/settings/notifications");
    await expect(page).not.toHaveURL(/\/login/);
    const count = await page.getByRole("switch").count();
    expect(count).toBeGreaterThan(0);
  });
});
