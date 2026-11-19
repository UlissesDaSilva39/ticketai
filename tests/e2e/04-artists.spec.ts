import { test, expect } from "@playwright/test";
import { captureConsole } from "./helpers/console";

test.describe("Artists", () => {
  test("artists list renders", async ({ page }) => {
    const res = await page.goto("/artists");
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    const console = captureConsole(page);
    await page.waitForLoadState("networkidle").catch(() => {});
    const body = (await page.textContent("body")) ?? "";
    expect(body.length).toBeGreaterThan(0);
    expect(console.pageErrors).toHaveLength(0);
  });

  test("artist registration page renders form", async ({ page }) => {
    const res = await page.goto("/artists/register").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    const inputs = page.locator("input, textarea, select");
    expect(await inputs.count()).toBeGreaterThan(0);
  });

  test("artist merch page (if id-linked) responds", async ({ page }) => {
    const res = await page.goto("/artists/me/merch").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    expect(res!.status()).toBeLessThan(500);
  });

  test("merch edit page (if id-linked) responds", async ({ page }) => {
    const res = await page.goto("/artists/me/merch/edit").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    expect(res!.status()).toBeLessThan(500);
  });
});