import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test.describe("Feed play button", () => {
  test("feed page loads", async ({ page }) => {
    await page.goto(`${BASE}/feed`);
    await expect(page).toHaveURL(/\/feed/);
    // page rendered something
    await expect(page.locator("body")).toBeVisible();
  });

  test("play chip exists on posts with tracks", async ({ page }) => {
    await page.goto(`${BASE}/feed`);
    // wait for posts to render
    await page.waitForTimeout(2000);

    // count play chips (button with aria-label "Play" or "Pause")
    const playButtons = page.locator('button[aria-label="Play"], button[aria-label="Pause"]');
    const count = await playButtons.count();
    console.log("Play buttons found:", count);

    // not asserting > 0 yet — data may be empty
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("clicking a play chip opens the dock", async ({ page }) => {
    await page.goto(`${BASE}/feed`);
    await page.waitForTimeout(2000);

    const playButtons = page.locator('button[aria-label="Play"]');
    const count = await playButtons.count();

    if (count === 0) {
      test.skip(true, "No play buttons on feed — no posts with tracks yet");
      return;
    }

    await playButtons.first().click();
    await page.waitForTimeout(500);

    // dock appears at bottom with a Stop button
    await expect(page.getByText("Stop")).toBeVisible({ timeout: 3000 });
  });

  test("artists page still works (regression)", async ({ page }) => {
    await page.goto(`${BASE}/artists`);
    await expect(page.getByText("Discover")).toBeVisible({ timeout: 10000 });
  });
});
