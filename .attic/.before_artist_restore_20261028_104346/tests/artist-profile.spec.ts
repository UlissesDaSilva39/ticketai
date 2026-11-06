import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test.describe("Artist profile — listening mode", () => {
  test("renders hero and Play all button", async ({ page }) => {
    // Use the first artist from /artists
    await page.goto(`${BASE}/artists`);
    await page.waitForLoadState("networkidle");

    // Find the first artist card link
    const artistLink = page.locator('a[href^="/artists/"]').first();
    const count = await artistLink.count();
    if (count === 0) {
      test.skip(true, "no artist links to test against");
      return;
    }

    const href = await artistLink.getAttribute("href");
    expect(href).toBeTruthy();

    await page.goto(`${BASE}${href}`);
    await page.waitForLoadState("networkidle");

    // The hero renders with a Play all button
    await expect(page.getByRole("button", { name: /play all/i }).first()).toBeVisible();

    // And the sidebar is present
    await expect(page.getByText("YOUR LIBRARY")).toBeVisible();
  });

  test("Play all button starts playback when tracks exist", async ({ page }) => {
    await page.goto(`${BASE}/artists`);
    await page.waitForLoadState("networkidle");

    const artistLink = page.locator('a[href^="/artists/"]').first();
    if ((await artistLink.count()) === 0) {
      test.skip(true, "no artist links");
      return;
    }
    const href = await artistLink.getAttribute("href");
    await page.goto(`${BASE}${href}`);
    await page.waitForLoadState("networkidle");

    const playAll = page.getByRole("button", { name: /play all/i }).first();
    const disabled = await playAll.isDisabled();
    if (disabled) {
      test.skip(true, "artist has no playable tracks");
      return;
    }

    await playAll.click();
    await page.waitForTimeout(400);

    // dock "Stop" appears
    await expect(page.getByRole("button", { name: /stop/i })).toBeVisible({ timeout: 5_000 });
  });

  test("track row play chips exist and are clickable", async ({ page }) => {
    await page.goto(`${BASE}/artists`);
    await page.waitForLoadState("networkidle");

    const artistLink = page.locator('a[href^="/artists/"]').first();
    if ((await artistLink.count()) === 0) {
      test.skip(true, "no artist links");
      return;
    }
    const href = await artistLink.getAttribute("href");
    await page.goto(`${BASE}${href}`);
    await page.waitForLoadState("networkidle");

    const chips = page.locator('button[aria-label="Play"]');
    const count = await chips.count();
    if (count === 0) {
      test.skip(true, "artist has no tracks");
      return;
    }

    await chips.first().click();
    await page.waitForTimeout(400);
    await expect(page.getByRole("button", { name: /stop/i })).toBeVisible({ timeout: 5_000 });
  });
});
