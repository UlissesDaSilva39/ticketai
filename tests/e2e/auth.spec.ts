import { test, expect } from "./fixtures/base";

test.describe("auth — login flow", () => {
  test("test user can log in and reach /home", async ({ browser }) => {
    const email = process.env.PLAYWRIGHT_TEST_EMAIL;
    const password = process.env.PLAYWRIGHT_TEST_PASSWORD;
    if (!email || !password) test.skip(true, "Credentials not set");

    // Fresh context — no stored session
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded" });

    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await page
      .getByRole("button", { name: /sign in|log in|login|continue/i })
      .first()
      .click();

    await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20_000 });

    await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/home");

    const body = await page.locator("body").innerText();
    expect(body.toLowerCase()).not.toContain("this page could not be found");

    await ctx.close();
  });

  test("unauthenticated user is redirected from /home to /login", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/login");

    await ctx.close();
  });

  test("unauthenticated user is redirected from /notifications to /login", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto("http://localhost:3000/notifications", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/login");

    await ctx.close();
  });

  test("unauthenticated user is redirected from /profile to /login", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto("http://localhost:3000/profile", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/login");

    await ctx.close();
  });
});

test.describe("auth — signed in user", () => {
  test("storageState grants access to /home", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/home");
  });

  test("storageState grants access to /notifications", async ({ page }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/notifications");
    expect(page.url()).not.toContain("/login");
  });

  test("storageState grants access to /profile", async ({ page }) => {
    await page.goto("/profile", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/profile");
    expect(page.url()).not.toContain("/login");
  });

  test("storageState grants access to /settings", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/settings");
    expect(page.url()).not.toContain("/login");
  });
});
