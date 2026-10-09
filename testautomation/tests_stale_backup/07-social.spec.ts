import { test, expect } from "@playwright/test";
import { login, CREDS } from "../helpers/auth";

test.describe("07 - Social", () => {
  test.beforeEach(async ({ page }) => login(page, ...CREDS.alice));

  for (const path of ["/messages", "/friends", "/people", "/bookmarked"]) {
    test(`page loads: ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page).not.toHaveURL(/\/login/);
    });
  }
});
