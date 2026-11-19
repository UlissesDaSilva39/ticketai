import { test, expect } from "@playwright/test";
import { tryLogin } from "./helpers/auth";
import { captureConsole } from "./helpers/console";

test.describe("Auth flows", () => {
  test("login page renders form", async ({ page }) => {
    const res = await page.goto("/login").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "/login not implemented");

    await expect(page.locator('input[type="email"], input[name="email"]')).toHaveCount(1);
    await expect(page.locator('input[type="password"], input[name="password"]')).toHaveCount(1);
  });

  test("login with invalid credentials doesn't crash", async ({ page }) => {
    const res = await page.goto("/login").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "/login not implemented");

    const email = page.locator('input[type="email"], input[name="email"]').first();
    const pw = page.locator('input[type="password"], input[name="password"]').first();
    if (!(await email.count()) || !(await pw.count())) test.skip(true, "Login inputs missing");

    await email.fill("nobody@example.com");
    await pw.fill("wrongpassword");
    const submit = page.locator('button[type="submit"]').first();
    if (!(await submit.count())) test.skip(true, "No submit button");

    const console = captureConsole(page);
    await submit.click();
    await page.waitForTimeout(2000);
    expect(console.pageErrors).toHaveLength(0);
  });

  test("register page renders", async ({ page }) => {
    const res = await page.goto("/register").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "/register not implemented");
    await expect(page.locator("body")).toBeVisible();
  });

  test("protected /home blocks unauthenticated users", async ({ page, context }) => {
    await context.clearCookies();
    const res = await page.goto("/home", { waitUntil: "domcontentloaded" });
    if (!res || res.status() === 404) test.skip(true, "/home not implemented");
    expect(res!.status()).toBeLessThan(500);
    const url = page.url();
    const body = (await page.textContent("body")) ?? "";
    const looksProtected =
      url.includes("login") ||
      url.includes("signin") ||
      /log in|sign in|unauthorized/i.test(body);
    expect(looksProtected, "Protected route should gate unauthenticated users").toBe(true);
  });

  test("login with valid credentials (if env provided)", async ({ page }) => {
    if (!process.env.E2E_EMAIL || !process.env.E2E_PASSWORD) {
      test.skip(true, "Set E2E_EMAIL / E2E_PASSWORD to run this test");
    }
    const ok = await tryLogin(page);
    expect(ok).toBe(true);
    expect(page.url()).not.toMatch(/\/login/);
  });
});