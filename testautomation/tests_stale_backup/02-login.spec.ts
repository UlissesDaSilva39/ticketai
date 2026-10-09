import { test, expect } from "@playwright/test";
import { TEST_USERS } from "../helpers/auth";

test.describe("Login / Signup page", () => {
  test("renders sign-in form by default", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("switches to signup mode", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /create one/i }).click();
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /buy tickets/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /promote events/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /list my venue/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /register as an artist/i })).toBeVisible();
  });

  test("signs in with demo user", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(TEST_USERS.demo.email);
    await page.getByLabel(/password/i).fill(TEST_USERS.demo.password);
    await page.getByRole("button", { name: /^sign in$/i }).click();
    await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
      timeout: 15000,
    });
    await expect(
      page.locator("header").getByRole("link", { name: /my tickets/i })
    ).toBeVisible();
  });
});
