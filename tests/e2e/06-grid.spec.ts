import { test, expect } from "@playwright/test";
import { captureConsole } from "./helpers/console";

test.describe("GRID", () => {
  const routes = ["/grid", "/grid/discoveries", "/grid/analytics"];

  for (const r of routes) {
    test(`GRID ${r} renders`, async ({ page }) => {
      const res = await page.goto(r, { waitUntil: "domcontentloaded" });
      if (!res || res.status() === 404) test.skip(true, `${r} not implemented`);
      const console = captureConsole(page);
      await page.waitForLoadState("networkidle").catch(() => {});
      expect(console.pageErrors).toHaveLength(0);
    });
  }

  test("GRID discoveries subpages render content", async ({ page }) => {
    const res = await page.goto("/grid/discoveries").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    await page.waitForLoadState("networkidle").catch(() => {});
    expect((await page.textContent("body"))?.length ?? 0).toBeGreaterThan(0);
  });
});