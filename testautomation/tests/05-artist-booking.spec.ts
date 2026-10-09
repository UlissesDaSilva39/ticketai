import { test, expect } from "@playwright/test";

const ARTIST_SLUG = process.env.ARTIST_SLUG || "demoticketaiorguk";

test.describe("Artist booking flow", () => {
  test("shows a calendar", async ({ page }) => {
    await page.goto(`/artist/${ARTIST_SLUG}`);
    await expect(page.getByRole("heading", { name: /book this artist/i })).toBeVisible();
  });

  test("submits a booking request", async ({ page }) => {
    await page.goto(`/artist/${ARTIST_SLUG}`);
    const bookSection = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: /book this artist/i }) });

    const dayButton = bookSection
      .locator("button")
      .filter({ hasNotText: /◀|▶|Mon|Tue|Wed|Thu|Fri|Sat|Sun/ })
      .first();
    await dayButton.click();

    await bookSection.getByPlaceholder(/your name/i).fill("Playwright Tester");
    await bookSection.getByPlaceholder(/email/i).fill("pw@example.com");
    await bookSection.getByPlaceholder(/venue/i).fill("Test Venue");
    await bookSection.getByPlaceholder(/tell us about the event/i).fill("Test message");

    await page.getByRole("button", { name: /send request/i }).click();
    await expect(page.getByText(/request sent|will get back to you/i)).toBeVisible({
      timeout: 10000,
    });
  });
});
