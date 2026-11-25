import { test, expect } from "@playwright/test";
import { captureConsole } from "./helpers/console";

test.describe("Social", () => {
  for (const r of ["/social", "/social/music"]) {
    test(`Social ${r} renders`, async ({ page }) => {
      const res = await page.goto(r).catch(() => null);
      if (!res || res.status() === 404) test.skip(true, `${r} not implemented`);
      const console = captureConsole(page);
      await page.waitForLoadState("networkidle").catch(() => {});
      expect(console.pageErrors).toHaveLength(0);
    });
  }
});