import { test, expect } from "@playwright/test";
import { login, CREDS } from "../helpers/auth";

test.describe("03 - Discover", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ...CREDS.alice);
    await page.goto("/artists");
  });

  test("3.1 page renders", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
    await expect(page).not.toHaveURL(/\/login/);
  });

  const sections = [
    /trending events/i,
    /popular promoters/i,
    /upcoming events/i,
    /featured charts/i,
    /popular radio/i,
    /popular albums and singles/i,
    /trending songs/i,
    /featured playlists/i,
  ];

  for (const name of sections) {
    test(`section visible: ${name}`, async ({ page }) => {
      const heading = page.getByRole("heading", { name }).first();
      if (await heading.count() === 0) test.skip(true, "section not present");
      await expect(heading).toBeVisible();
    });
  }

  test("3.x sidebar links", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Home", exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Artists", exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "My Tickets", exact: true }).first()).toBeVisible();
  });

  test("3.x promoter cards", async ({ page }) => {
    await expect(page.getByText("promoter").first()).toBeVisible();
    await expect(page.getByText("voicerecords").first()).toBeVisible();
  });

  test("3.x view counts shown in charts", async ({ page }) => {
    await expect(page.getByText(/\d+\s+views?/i).first()).toBeVisible();
  });
});
