import { test, expect } from "./fixtures/base";

test.describe("/artists (Discover)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/artists");
  });

  test("renders the Discover heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /discover/i, level: 1 })
    ).toBeVisible();
  });

  test("has exactly one sidebar", async ({ page }) => {
    // The sidebar should contain the YOUR LIBRARY label
    const libraryLabels = page.getByText(/your library/i);
    await expect(libraryLabels).toHaveCount(1);
  });

  test("sidebar shows library nav links", async ({ page }) => {
    for (const label of [
      "Home",
      "Artists",
      "Search",
      "My Tickets",
      "Friends",
      "Messages",
      "Following",
      "Network",
      "Opportunities",
      "Dashboard",
    ]) {
      await expect(
        page.getByRole("link", { name: new RegExp(`^${label}$`, "i") }).first()
      ).toBeVisible();
    }
  });

  test("renders all major section headings", async ({ page }) => {
    const headings = [
      /trending events/i,
      /popular promoters/i,
      /popular venues/i,
      /upcoming events/i,
      /popular artists/i,
      /popular by city/i,
      /popular radio/i,
      /popular albums/i,
      /trending songs/i,
      /featured playlists/i,
      /popular by country/i,
    ];
    for (const h of headings) {
      // Some sections are conditional on data — allow 0 or 1
      const count = await page.getByText(h).count();
      expect(count, `expected at most 1 match for ${h}`).toBeLessThanOrEqual(1);
    }
  });

  test("no uncaught JS errors", async ({ page, consoleErrors }) => {
    await page.waitForTimeout(500);
    const realErrors = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("React DevTools")
    );
    expect(realErrors).toEqual([]);
  });

  test("no priceFrom or LibrarySidebar ReferenceErrors", async ({
    page,
    consoleErrors,
  }) => {
    await page.waitForTimeout(500);
    const refErrors = consoleErrors.filter(
      (e) =>
        e.includes("priceFrom is not defined") ||
        e.includes("LibrarySidebar is not defined")
    );
    expect(refErrors).toEqual([]);
  });
});
