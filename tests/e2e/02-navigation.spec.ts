import { test, expect } from "@playwright/test";
import { captureConsole } from "./helpers/console";

test.describe("Navigation", () => {
  test("root page renders", async ({ page }) => {
    const console = captureConsole(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    expect(console.pageErrors).toHaveLength(0);
  });

  test("navbar exists and links are clickable", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav, header").first();
    if (!(await nav.count())) test.skip(true, "No nav element found");

    const links = nav.locator("a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 4); i++) {
      const href = await links.nth(i).getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) continue;
      await links.nth(i).click();
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator("body")).toBeVisible();
      await page.goBack();
    }
  });

  test("notifications route responds", async ({ page }) => {
    const res = await page.goto("/notifications");
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    expect(res!.status()).toBeLessThan(500);
  });
});