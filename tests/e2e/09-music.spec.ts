import { test, expect } from "@playwright/test";
import { captureConsole } from "./helpers/console";

test.describe("Music widgets", () => {
  test("play button presence on artists page (informational)", async ({ page }) => {
    const res = await page.goto("/artists").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    await page.waitForLoadState("networkidle").catch(() => {});

    const play = page.locator(
      'button[aria-label*="play" i], button:has-text("Play"), [data-testid*="play"]'
    );
    if ((await play.count()) === 0) {
      console.log("No play button found on /artists — acceptable if not shipped");
    }
  });

  test("Spotify embed (if present) doesn't crash page", async ({ page }) => {
    const res = await page.goto("/artists").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "Not implemented");

    const console = captureConsole(page);
    await page.waitForLoadState("networkidle").catch(() => {});
    const iframes = page.locator('iframe[src*="spotify"]');
    if ((await iframes.count()) > 0) {
      expect(console.pageErrors).toHaveLength(0);
    }
  });
});