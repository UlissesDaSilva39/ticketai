import { test, expect } from "@playwright/test";

const ARTIST_SLUG = process.env.ARTIST_SLUG || "demoticketaiorguk";

test.describe("Artist profile page", () => {
  test("loads the artist profile", async ({ page }) => {
    const res = await page.goto(`/artist/${ARTIST_SLUG}`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("renders About section", async ({ page }) => {
    await page.goto(`/artist/${ARTIST_SLUG}`);
    await expect(page.getByRole("heading", { name: /^about$/i })).toBeVisible();
  });

  test("renders Music section", async ({ page }) => {
    await page.goto(`/artist/${ARTIST_SLUG}`);
    await expect(page.getByRole("heading", { name: /^music$/i })).toBeVisible();
  });

  test("renders Book this artist section", async ({ page }) => {
    await page.goto(`/artist/${ARTIST_SLUG}`);
    await expect(page.getByRole("heading", { name: /book this artist/i })).toBeVisible();
  });

  test("renders Get in touch sidebar", async ({ page }) => {
    await page.goto(`/artist/${ARTIST_SLUG}`);
    await expect(page.getByRole("heading", { name: /get in touch/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /message the artist/i })).toBeVisible();
  });

  test("renders Location, Links, Details", async ({ page }) => {
    await page.goto(`/artist/${ARTIST_SLUG}`);
    await expect(page.getByRole("heading", { name: /^location$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^links$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^details$/i })).toBeVisible();
  });
});
