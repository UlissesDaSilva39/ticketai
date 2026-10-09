import { test, expect } from "@playwright/test";
import { login, logout, expectRedirectToLogin, CREDS } from "../helpers/auth";

test.describe("01 - Auth", () => {
  test("1.1 /login renders form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input[type=\"email\"], input[name=\"email\"]").first()).toBeVisible();
    await expect(page.locator("input[type=\"password\"]").first()).toBeVisible();
  });

  test("1.2 sign in redirects home", async ({ page }) => {
    await login(page, ...CREDS.alice);
    await expect(page).toHaveURL(/\/$/);
  });

  test("1.3 session persists on reload", async ({ page }) => {
    await login(page, ...CREDS.alice);
    await page.reload();
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("1.4 /my-tickets renders when signed in", async ({ page }) => {
    await login(page, ...CREDS.alice);
    await page.goto("/my-tickets");
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("1.5 sign out clears session", async ({ page }) => {
    await login(page, ...CREDS.alice);
    await logout(page);
    await page.goto("/my-tickets");
    await expect(page).toHaveURL(/\/login/);
  });

  test("1.6 /my-tickets redirects when signed out", ({ page }) =>
    expectRedirectToLogin(page, "/my-tickets"));

  test("1.7 /settings/notifications redirects when signed out", ({ page }) =>
    expectRedirectToLogin(page, "/settings/notifications"));

  test("1.8 promoter can sign in", async ({ page }) => {
    await login(page, ...CREDS.promoter);
    await expect(page).toHaveURL(/\/$/);
  });
});
