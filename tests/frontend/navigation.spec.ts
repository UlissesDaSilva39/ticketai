import { test, expect } from "@playwright/test";

test.describe("Frontend - Navigation", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/home"); });

  test("renders GRID logo", async ({ page }) => {
    await expect(page.getByRole("link", { name: "GRID" }).first()).toBeVisible();
  });

  test("search bar visible", async ({ page }) => {
    await expect(page.getByPlaceholder("Search")).toBeVisible();
  });

  test("search inside form targeting /search", async ({ page }) => {
    await expect(page.locator('form[action="/search"]')).toBeVisible();
  });

  test("search submits on Enter", async ({ page }) => {
    await page.getByPlaceholder("Search").fill("techno");
    await page.getByPlaceholder("Search").press("Enter");
    await page.waitForURL(/\/search\?q=techno/);
  });

  for (const [label, path] of [
    ["Home", "/home"], ["Network", "/network"], ["Jobs", "/jobs"],
    ["Payments", "/payments"], ["Splits", "/splits"],
    ["Messaging", "/messaging"], ["Notifications", "/notifications"],
  ] as [string, string][]) {
    test(`navbar "${label}" routes to ${path}`, async ({ page }) => {
      await page.getByRole("link", { name: label, exact: true }).click();
      await page.waitForURL(new RegExp(path));
    });
  }

  test("Me dropdown opens", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await expect(page.getByRole("link", { name: "View Profile" })).toBeVisible();
  });

  test("Me dropdown closes on outside click", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await page.locator("body").click({ position: { x: 10, y: 400 } });
    await expect(page.getByRole("link", { name: "View Profile" })).toBeHidden();
  });

  test("View Profile routes", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await page.getByRole("link", { name: "View Profile" }).click();
    await page.waitForURL("/profile");
  });

  test("For Business dropdown opens", async ({ page }) => {
    await page.getByRole("button", { name: /For Business/i }).click();
    await expect(page.getByText("GRID Business")).toBeVisible();
  });

  test("Venue Dashboard routes", async ({ page }) => {
    await page.getByRole("button", { name: /For Business/i }).click();
    await page.getByRole("link", { name: /Venue Dashboard/ }).click();
    await page.waitForURL("/business");
  });

  test("Artist EPKs routes", async ({ page }) => {
    await page.getByRole("button", { name: /For Business/i }).click();
    await page.getByRole("link", { name: /Artist EPKs/ }).click();
    await page.waitForURL("/epk");
  });

  test("Venue Calendar routes", async ({ page }) => {
    await page.getByRole("button", { name: /For Business/i }).click();
    await page.getByRole("link", { name: /Venue Calendar/ }).click();
    await page.waitForURL("/calendar");
  });

  test("theme toggle dark", async ({ page }) => {
    await page.getByRole("button", { name: /Theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("theme persists after reload", async ({ page }) => {
    await page.getByRole("button", { name: /Theme/i }).click();
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  for (const [w, h] of [[375, 812], [768, 1024], [1440, 900], [1920, 1080]] as [number, number][]) {
    test(`no horizontal scroll at ${w}x${h}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      const sw = await page.evaluate(() => document.body.scrollWidth);
      expect(sw).toBeLessThanOrEqual(w + 5);
    });
  }
});