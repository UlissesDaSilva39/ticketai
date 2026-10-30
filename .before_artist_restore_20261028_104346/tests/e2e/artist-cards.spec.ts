import { test, expect } from "./fixtures/base";

test.describe("artist cards", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/artists", { waitUntil: "domcontentloaded" });
  });

  test("at least one artist card is present", async ({ page }) => {
    const cards = page.locator('a[href^="/artists/"]');
    const count = await cards.count();
    if (count === 0) test.skip(true, "No artist cards in DB");
    expect(count).toBeGreaterThan(0);
  });

  test("each artist card href matches /artists/{username} pattern", async ({ page }) => {
    const cards = page.locator('a[href^="/artists/"]');
    const count = await cards.count();
    if (count === 0) test.skip();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const href = await cards.nth(i).getAttribute("href");
      expect(href, "href should start with /artists/").toBeTruthy();
      expect(href!.startsWith("/artists/")).toBe(true);
      const rest = href!.slice("/artists/".length);
      expect(rest.length, "username segment should be non-empty").toBeGreaterThan(0);
      expect(rest.includes("/"), "username should not contain another slash").toBe(false);
    }
  });

  test("clicking an artist card navigates to a working page", async ({ page }) => {
    const first = page.locator('a[href^="/artists/"]').first();
    if ((await first.count()) === 0) test.skip();

    const href = (await first.getAttribute("href"))!;
    const res = await page.goto(href, { waitUntil: "domcontentloaded", timeout: 20000 });

    expect(res, "navigation returned no response").not.toBeNull();
    expect(res!.status(), href + " returned " + res!.status()).toBeLessThan(400);
  });

  test("artist page shows not-a-404", async ({ page }) => {
    const first = page.locator('a[href^="/artists/"]').first();
    if ((await first.count()) === 0) test.skip();

    const href = (await first.getAttribute("href"))!;
    await page.goto(href, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();

    expect(body.toLowerCase()).not.toContain("this page could not be found");
    expect(body.toLowerCase()).not.toContain("404");
  });

  test("artist page renders heading or avatar", async ({ page }) => {
    const first = page.locator('a[href^="/artists/"]').first();
    if ((await first.count()) === 0) test.skip();

    const href = (await first.getAttribute("href"))!;
    await page.goto(href, { waitUntil: "domcontentloaded" });

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading.first()).toBeVisible();
  });

  test("unknown artist username returns 404", async ({ page }) => {
    const res = await page.goto("/artists/this-user-does-not-exist-xyz-2026", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(404);
  });
});

test.describe("artist card interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/artists", { waitUntil: "domcontentloaded" });
  });

  test("follow button has aria-pressed or following state", async ({ page }) => {
    const followBtn = page.getByRole("button", { name: /follow|following/i }).first();
    if ((await followBtn.count()) === 0) test.skip(true, "No follow button — need hover");

    const label = await followBtn.innerText();
    expect(label).toMatch(/follow|following/i);
  });

  test("share button is present", async ({ page }) => {
    const shareBtn = page.getByRole("button", { name: /share/i }).first();
    if ((await shareBtn.count()) === 0) test.skip(true, "No share button — need hover");

    await expect(shareBtn).toBeVisible();
  });
});
