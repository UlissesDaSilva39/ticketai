import { test, expect } from "./fixtures/base";

test.describe("dynamic routes with real data", () => {
  test("first event card links to a working /event/[id]", async ({ page }) => {
    await page.goto("/artists");
    const firstEventLink = page
      .locator('a[href^="/event/"]')
      .first();

    if ((await firstEventLink.count()) === 0) {
      test.skip(true, "No events in DB � skipping dynamic event test");
      return;
    }

    const href = await firstEventLink.getAttribute("href");
    expect(href).toBeTruthy();

    const res = await page.goto(href!, { timeout: 20000 });
    expect(res!.status()).toBeLessThan(400);

    const body = await page.locator("body").innerText();
    expect(body.length).toBeGreaterThan(50);
  });

  test("first artist card links to a working /artists/[username]", async ({
    page,
  }) => {
    await page.goto("/artists");
    const firstArtistLink = page.locator('a[href^="/artists/"]').first();

    if ((await firstArtistLink.count()) === 0) {
      test.skip(true, "No artists in DB � skipping");
      return;
    }

    const href = await firstArtistLink.getAttribute("href");
    const res = await page.goto(href!, { timeout: 20000 });
    expect(res!.status()).toBeLessThan(400);
  });
});
